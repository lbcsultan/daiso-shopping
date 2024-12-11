'use server'

import { auth } from '@/auth'
import { getMyCart } from './cart.actions'
import { getUserById } from './user.actions'
import { redirect } from 'next/navigation'
import { insertOrderSchema } from '../validator'
import db from '@/db/drizzle'
import { carts, orderItems, orders, products } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { formatError } from '../utils'

// CREATE
export const createOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')
    const cart = await getMyCart()
    const user = await getUserById(session?.user.id!)
    if (!cart || cart.items.length === 0) redirect('/cart')
    if (!user.address) redirect('/shipping-address')
    if (!user.paymentMethod) redirect('/payment-method')

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: JSON.stringify(user.address),
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    })
    const insertedOrderId = await db.transaction(async (tx) => {
      const insertedOrder = await tx
        .insert(orders)
        .values({
          userId: sql`${order.userId}`,
          shippingAddress: sql`${order.shippingAddress}`,
          paymentMethod: sql`${order.paymentMethod}`,
          itemsPrice: sql`${order.itemsPrice}`,
          shippingPrice: sql`${order.shippingPrice}`,
          taxPrice: sql`${order.taxPrice}`,
          totalPrice: sql`${order.totalPrice}`,
        })
        .returning({ id: orders.id })

      for (const item of cart.items) {
        const productExists = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1)

        if (!productExists.length) {
          throw new Error(
            `죄송합니다. 장바구니의 일부 상품이 더 이상 존재하지 않습니다. 장바구니를 다시 확인해주세요.`
          )
        }

        await tx.insert(orderItems).values({
          ...item,
          price: item.price.toFixed(2),
          orderId: insertedOrder[0].id,
        })
      }
      await db
        .update(carts)
        .set({
          items: [],
          totalPrice: '0',
          shippingPrice: '0',
          taxPrice: '0',
          itemsPrice: '0',
        })
        .where(eq(carts.id, cart.id))
      return insertedOrder[0].id
    })
    if (!insertedOrderId) throw new Error('Order not created')
    redirect(`/order/${insertedOrderId}`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: formatError(error) }
  }
}

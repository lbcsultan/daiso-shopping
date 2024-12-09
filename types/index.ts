// export interface Product {
//   name: string
//   slug: string
//   category: string
//   images: string[]
//   price: string
//   brand: string
//   rating: string
//   numReviews: number
//   stock: number
//   description: string
//   isFeatured?: boolean
//   banner?: string
// }

import { carts, products } from '@/db/schema'
import { cartItemSchema } from '@/lib/validator'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

// PRODUCTS
export type Product = InferSelectModel<typeof products>

export type CartItem = z.infer<typeof cartItemSchema>

// CART
export type Cart = InferSelectModel<typeof carts>

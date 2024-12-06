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

import { products } from '@/db/schema'
import { InferSelectModel } from 'drizzle-orm'

// PRODUCTS
export type Product = InferSelectModel<typeof products>

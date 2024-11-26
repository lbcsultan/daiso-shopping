import ProductList from '@/components/shared/product/product-list'
import sampleData from '@/lib/sample-data'
import { Product } from '@/types'

export default function Home() {
  const validatedProducts: Product[] = sampleData.products.map((product) => ({
    ...product,
    isFeatured: product.isFeatured ?? false,
  }))

  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList data={validatedProducts} />
    </div>
  )
}

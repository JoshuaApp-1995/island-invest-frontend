import { CategoryCard } from "@/components/category-card"
import type { ListingCategory } from "@/lib/types"

const categories: ListingCategory[] = [
  "terrain",
  "house",
  "airbnb",
  "commercial",
  "business",
  "tourism",
]

export function CategoriesSection() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Explore by Category
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Find exactly what you&apos;re looking for across our diverse investment categories
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}

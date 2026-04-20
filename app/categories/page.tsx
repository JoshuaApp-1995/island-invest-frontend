import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
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

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Explore Categories
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find the perfect investment opportunity across our diverse categories
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

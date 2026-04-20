import Link from "next/link"
import { Home, Mountain, Building2, Store, Briefcase, Palmtree } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ListingCategory } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/types"

const categoryIcons: Record<ListingCategory, React.ReactNode> = {
  terrain: <Mountain className="h-8 w-8" />,
  house: <Home className="h-8 w-8" />,
  airbnb: <Building2 className="h-8 w-8" />,
  commercial: <Store className="h-8 w-8" />,
  business: <Briefcase className="h-8 w-8" />,
  tourism: <Palmtree className="h-8 w-8" />,
}

const categoryColors: Record<ListingCategory, string> = {
  terrain: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  house: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  airbnb: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
  commercial: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
  business: "bg-slate-50 text-slate-600 group-hover:bg-slate-100",
  tourism: "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
}

interface CategoryCardProps {
  category: ListingCategory
  count?: number
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link href={`/listings?category=${category}`}>
      <Card className="group transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${categoryColors[category]}`}
          >
            {categoryIcons[category]}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary">
              {CATEGORY_LABELS[category]}
            </h3>
            <p className="text-sm text-muted-foreground">
              {count !== undefined ? `${count} listings` : CATEGORY_DESCRIPTIONS[category]}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

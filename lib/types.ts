export type ListingCategory =
  | "terrain"
  | "house"
  | "airbnb"
  | "commercial"
  | "business"
  | "tourism"

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  category: ListingCategory
  price: number
  currency: string
  location: string
  latitude: number | null
  longitude: number | null
  status: "draft" | "published" | "sold"
  is_premium: boolean
  payment_status: "none" | "pending" | "approved" | "rejected"
  payment_receipt: string | null
  slug?: string
  created_at: Date
  updated_at: Date
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  pathname: string
  type: "image" | "video"
  position: number
  created_at: Date
}

export interface ListingWithImages extends Listing {
  images: ListingImage[]
  user_name?: string
  user_avatar?: string | null
  reviews?: { rating: number }[]
}

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  terrain: "Land/Terrain",
  house: "Houses",
  airbnb: "Airbnb Rentals",
  commercial: "Commercial",
  business: "Businesses",
  tourism: "Tourism",
}

export const CATEGORY_ICONS: Record<ListingCategory, string> = {
  terrain: "Mountain",
  house: "Home",
  airbnb: "Building2",
  commercial: "Store",
  business: "Briefcase",
  tourism: "Palmtree",
}

export const CATEGORY_DESCRIPTIONS: Record<ListingCategory, string> = {
  terrain: "Buildable lots and land parcels",
  house: "Residential properties for sale",
  airbnb: "Short-term rental properties",
  commercial: "Commercial real estate",
  business: "Established businesses for sale",
  tourism: "Tourism-related opportunities",
}

export const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "DOP", label: "DOP (RD$)" },
  { value: "EUR", label: "EUR (€)" },
]

export const CARIBBEAN_LOCATIONS = [
  "Azua",
  "Baoruco",
  "Barahona",
  "Bávaro",
  "Bayahíbe",
  "Boca Chica",
  "Cabarete",
  "Cap Cana",
  "Constanza",
  "Dajabón",
  "Distrito Nacional",
  "Duarte",
  "El Seibo",
  "Elías Piña",
  "Espaillat",
  "Hato Mayor",
  "Hermanas Mirabal",
  "Independencia",
  "Jarabacoa",
  "Juan Dolio",
  "La Altagracia",
  "La Romana",
  "La Vega",
  "Las Terrenas",
  "María Trinidad Sánchez",
  "Monseñor Nouel",
  "Monte Cristi",
  "Monte Plata",
  "Pedernales",
  "Peravia",
  "Puerto Plata",
  "Punta Cana",
  "Samaná",
  "San Cristóbal",
  "San José de Ocoa",
  "San Juan",
  "San Pedro de Macorís",
  "Sánchez Ramírez",
  "Santiago",
  "Santiago Rodríguez",
  "Santo Domingo",
  "Sosúa",
  "Valverde",
]

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedListings } from "@/components/home/featured-listings"
import { CategoriesSection } from "@/components/home/categories-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { CTASection } from "@/components/home/cta-section"
import { SEO } from "@/components/seo"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <SEO 
        title="Home - Premium Caribbean Real Estate"
        description="Discover the best real estate investment opportunities in the Dominican Republic. Land, villas, and beachfront properties."
      />
      <HeroSection />
      <CategoriesSection />
      <FeaturedListings />
      <WhyChooseUs />
      <CTASection />
    </div>
  )
}

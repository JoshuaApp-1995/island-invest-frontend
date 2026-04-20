import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground mb-6 italic">Last Updated: April 18, 2026</p>
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">By accessing and using IslandInvest, you agree to comply with and be bound by these Terms and Conditions.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="mb-6">IslandInvest provides a platform for listing real estate and business opportunities in the Caribbean. We are not real estate agents and do not participate in actual transactions.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
            <p className="mb-6">Users are responsible for the accuracy of the information provided in their listings. IslandInvest is not liable for any fraudulent or incorrect information provided by users.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Payments and Premium Listings</h2>
            <p className="mb-6">Payments made for premium listings are non-refundable once the listing has been approved and activated. We use manual verification for bank transfers.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

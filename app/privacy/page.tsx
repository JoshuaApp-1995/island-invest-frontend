import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground mb-6 italic">Last Updated: April 18, 2026</p>
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-6">We collect personal information such as name, email, and phone number when you register or publish a listing.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Information</h2>
            <p className="mb-6">We use your information to facilitate connections between buyers and sellers, and to improve our services.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Security</h2>
            <p className="mb-6">We implement security measures to protect your personal data. However, no method of transmission over the internet is 100% secure.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Third Parties</h2>
            <p className="mb-6">We do not sell your personal information to third parties. We may share information with service providers to facilitate our platform operations.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

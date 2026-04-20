import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="relative py-20 bg-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              About IslandInvest
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Connecting visionaries with the most exclusive investment opportunities in the Caribbean.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Founded in the heart of the Dominican Republic, IslandInvest was born from the need to modernize the local real estate market. Our mission is to provide a transparent, secure, and professional platform where owners and investors can connect without borders.
                </p>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  We specialize in land, tourism projects, and business opportunities that define the future of the Caribbean coastline.
                </p>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/about-image.jpg" 
                  alt="Paradise landscape" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

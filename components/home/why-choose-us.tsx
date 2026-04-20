import { Shield, TrendingUp, Users, MapPin } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "Every property and business listing is reviewed to ensure accuracy and legitimacy.",
  },
  {
    icon: TrendingUp,
    title: "Investment Growth",
    description:
      "Caribbean real estate has shown consistent appreciation, making it an ideal investment destination.",
  },
  {
    icon: Users,
    title: "Expert Network",
    description:
      "Connect with local experts, agents, and fellow investors to make informed decisions.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description:
      "Access exclusive properties in the most sought-after Caribbean destinations.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Choose IslandInvest
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/80">
            Your trusted partner for Caribbean investment opportunities
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/10">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import Image from "next/image"
import { FaFacebook as Facebook, FaInstagram as Instagram, FaTwitter as Twitter } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="IslandInvest"
                width={48}
                height={48}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">
                <span className="text-primary">Island</span>
                <span className="text-accent">Invest</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Your trusted platform for discovering premium properties, businesses, and investment opportunities across the Caribbean. From beachfront villas to thriving tourism ventures.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/listings?category=terrain" className="text-sm text-muted-foreground hover:text-foreground">
                  Land/Terrain
                </Link>
              </li>
              <li>
                <Link href="/listings?category=house" className="text-sm text-muted-foreground hover:text-foreground">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/listings?category=airbnb" className="text-sm text-muted-foreground hover:text-foreground">
                  Airbnb Rentals
                </Link>
              </li>
              <li>
                <Link href="/listings?category=commercial" className="text-sm text-muted-foreground hover:text-foreground">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/listings?category=business" className="text-sm text-muted-foreground hover:text-foreground">
                  Businesses
                </Link>
              </li>
              <li>
                <Link href="/listings?category=tourism" className="text-sm text-muted-foreground hover:text-foreground">
                  Tourism
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Popular Locations</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/listings?location=Punta%20Cana" className="text-sm text-muted-foreground hover:text-foreground">
                  Punta Cana
                </Link>
              </li>
              <li>
                <Link href="/listings?location=Santo%20Domingo" className="text-sm text-muted-foreground hover:text-foreground">
                  Santo Domingo
                </Link>
              </li>
              <li>
                <Link href="/listings?location=Samana" className="text-sm text-muted-foreground hover:text-foreground">
                  Samana
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground/80 space-y-4">
          <p className="max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> The information provided on IslandInvest is for general informational purposes only and does not constitute real estate, financial, legal, or investment advice. Property listings, prices, availability, and descriptions are subject to change without notice. IslandInvest acts solely as a listing platform and is not responsible for the accuracy of property details provided by users or third parties. Users are strongly advised to perform their own due diligence, seek independent professional advice, and independently verify all information before entering into any financial or real estate transactions. IslandInvest assumes no liability for any losses or damages arising from the use of this platform.
          </p>
          <p>
            &copy; {new Date().getFullYear()} IslandInvest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

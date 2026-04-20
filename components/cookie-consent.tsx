"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, X, Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay so it feels like a smooth entrance
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[calc(100%-2rem)] max-w-[400px] transition-all duration-700 ease-out origin-bottom-right ${
        visible 
          ? "translate-y-0 opacity-100 scale-100 rotate-0 perspective-1000" 
          : "translate-y-12 opacity-0 scale-95 rotate-2"
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 3D Elevated Card with Backdrop Blur */}
      <div className="relative rounded-2xl border border-white/20 bg-card/90 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/10 before:to-transparent">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            
            {/* Icon + Text */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  🍪 We use cookies to improve your experience
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  We use cookies and similar technologies to personalize content, analyze traffic, and provide the best experience on IslandInvest. By clicking "Accept All", you consent to our use of cookies.{" "}
                  <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Privacy Policy
                  </Link>{" "}
                  ·{" "}
                  <Link href="/terms" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Terms of Service
                  </Link>
                </p>

                {/* Cookie Details Toggle */}
                {showDetails && (
                  <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Essential Cookies</p>
                        <p>Required for the site to function. Cannot be disabled.</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Always Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Analytics Cookies</p>
                        <p>Help us understand how visitors use our site.</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Optional</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Preference Cookies</p>
                        <p>Remember your settings and preferences.</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Optional</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-lg shadow-primary/20"
                onClick={acceptAll}
              >
                <Check className="h-4 w-4" />
                Accept All
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={acceptEssential}
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs text-muted-foreground"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {showDetails ? "Hide Details" : "Preferences"}
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={acceptEssential}
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

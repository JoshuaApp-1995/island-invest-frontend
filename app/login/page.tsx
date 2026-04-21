"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { GoogleLogin } from "@react-oauth/google"

export default function LoginPage() {
  const { login, googleLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.")
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError("")
      await googleLogin(credentialResponse.credential)
    } catch (err: any) {
      setError(err.response?.data?.error || "Google login failed.")
    }
  }

  const handleFacebookSuccess = async (accessToken: string) => {
    try {
      setError("")
      // We'll need to add facebookLogin to useAuth
      // @ts-ignore
      await facebookLogin(accessToken)
    } catch (err: any) {
      setError(err.response?.data?.error || "Facebook login failed.")
    }
  }

  useState(() => {
    // Load FB SDK
    if (typeof window !== 'undefined' && !window.FB) {
      // @ts-ignore
      window.fbAsyncInit = function() {
        // @ts-ignore
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        // @ts-ignore
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        // @ts-ignore
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  })

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/80 to-emerald-600 overflow-hidden flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/30"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-4xl font-black italic text-white">I</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">IslandInvest</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            The premier marketplace for Caribbean real estate & investment opportunities.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { label: "Properties", value: "2,400+" },
              { label: "Investors", value: "8,500+" },
              { label: "Countries", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-white/70 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-black italic text-xl">I</span>
            </div>
            <span className="text-xl font-extrabold">IslandInvest</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          {/* Google Login */}
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <div className="w-full mb-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed.")}
                useOneTap
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
              />
            </div>
          )}

          {/* Facebook Login */}
          {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && (
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl mb-6 flex items-center justify-center gap-3 border-[#1877F2]/20 hover:bg-[#1877F2]/5 hover:text-[#1877F2] transition-all"
              onClick={() => {
                // @ts-ignore
                window.FB.login((response: any) => {
                  if (response.authResponse) {
                    handleFacebookSuccess(response.authResponse.accessToken);
                  } else {
                    setError("Facebook login cancelled.");
                  }
                }, { scope: 'public_profile,email' });
              }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign in with Facebook
            </Button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 focus:border-primary bg-muted/30 focus:bg-card transition-colors"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 focus:border-primary bg-muted/30 focus:bg-card transition-colors"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-5 w-5" />
              )}
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Loader2, User2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { GoogleLogin } from "@react-oauth/google"

export default function RegisterPage() {
  const { register, googleLogin } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed")
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError("")
      await googleLogin(credentialResponse.credential)
    } catch (err: any) {
      setError(err.response?.data?.error || "Google sign-up failed.")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-primary to-primary/90 overflow-hidden flex-col items-center justify-center p-12 text-white">
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
        <Link href="/" className="relative z-10 text-center max-w-md hover:opacity-80 transition-opacity">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-4xl font-black italic text-white">I</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Join IslandInvest</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Create your free account and start publishing or discovering premium Caribbean properties today.
          </p>
        </Link>
        <div className="mt-12 space-y-4">
            {[
              "List your property in minutes",
              "Reach thousands of investors",
              "Boost visibility with premium listings",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm text-left">
                <div className="w-2 h-2 rounded-full bg-emerald-300 shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

      {/* Right: Register form */}
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
            <h2 className="text-3xl font-extrabold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground mt-2">Join thousands of investors and property owners</p>
          </div>

          {/* Google Sign-Up */}
          <div className="w-full mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed.")}
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Or register with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold">Full Name</label>
              <div className="relative">
                <User2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 focus:border-primary bg-muted/30 focus:bg-card transition-colors"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 focus:border-primary bg-muted/30 focus:bg-card transition-colors"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-border/60 focus:border-primary bg-muted/30 focus:bg-card transition-colors"
                  autoComplete="new-password"
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
              Create Account
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-1">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CARIBBEAN_LOCATIONS } from "@/lib/types"

import { useLanguage } from "../../context/LanguageContext"

export function HeroSection() {
  const router = useRouter()
  const { t } = useLanguage()
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (location) params.set("location", location)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden">
      {/* Dynamic Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="relative z-10 h-full w-full object-cover"
          poster="/images/hero-caribbean.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-palm-trees-and-blue-water-4221-large.mp4" type="video/mp4" />
        </video>
        <Image
          src="/images/hero-caribbean.jpg"
          alt="Caribbean beachfront properties"
          fill
          className="object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/90 sm:text-xl">
            {t('hero.subtitle')}
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 rounded-xl bg-card/95 p-4 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('common.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative sm:w-48">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t('common.location')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {CARIBBEAN_LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {t('common.search')}
            </Button>
          </form>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/80">Active Listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-white/80">Locations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1000+</p>
              <p className="text-sm text-white/80">Happy Investors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

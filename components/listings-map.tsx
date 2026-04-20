"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ListingWithImages } from "@/lib/types"

interface ListingsMapProps {
  listings: any[]
}

import { getImageUrl } from "@/utils/image"

export default function ListingsMap({ listings }: ListingsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    if (!mapInstanceRef.current) {
      // Modern map style
      const map = L.map(mapRef.current, {
        zoomControl: false
      }).setView([18.7357, -70.1627], 8)
      
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
    }

    const map = mapInstanceRef.current

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Custom modern marker icon
    const createCustomIcon = (price: number) => L.divIcon({
      className: "custom-marker-container",
      html: `
        <div class="marker-bubble">
          <span class="marker-price">$${(price / 1000).toFixed(0)}k</span>
          <div class="marker-arrow"></div>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 30],
    })

    const style = document.createElement('style')
    style.innerHTML = `
      .custom-marker-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .marker-bubble {
        background: #1a1a1a;
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid white;
        position: relative;
        white-space: nowrap;
        transition: all 0.2s ease;
      }
      .marker-bubble:hover {
        background: #e07128;
        transform: scale(1.1);
        z-index: 1000;
      }
      .marker-arrow {
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid white;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 24px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      }
      .leaflet-popup-content {
        margin: 0;
        width: 280px !important;
      }
    `
    document.head.appendChild(style)

    const bounds = L.latLngBounds([])
    let hasValidCoords = false

    listings.forEach((listing) => {
      if (listing.latitude && listing.longitude) {
        const marker = L.marker([listing.latitude, listing.longitude], { 
          icon: createCustomIcon(listing.price) 
        }).addTo(map)

        const imageUrl = getImageUrl(listing.media?.[0]?.pathname || "")
        const isVideo = listing.media?.[0]?.pathname?.match(/\.(mp4|webm|ogg|mov)$/i)
        
        const popupContent = `
          <div class="group overflow-hidden rounded-3xl">
            <div class="h-32 overflow-hidden bg-black relative">
              ${isVideo ? 
                `<video src="${imageUrl}" class="w-full h-full object-cover opacity-70" />` : 
                `<img src="${imageUrl || '/placeholder.jpg'}" class="w-full h-full object-cover transition-transform group-hover:scale-110" />`
              }
            </div>
            <div class="p-4 space-y-2">
              <div class="flex justify-between items-start">
                <h4 class="font-black text-sm text-foreground line-clamp-1">${listing.title}</h4>
                <span class="text-primary font-black text-sm">$${listing.price.toLocaleString()}</span>
              </div>
              <p class="text-muted-foreground text-[10px] flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ${listing.location}
              </p>
              <a href="/listings/${listing.slug || listing.id}" class="block w-full text-center py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors mt-2">
                View Listing
              </a>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          closeButton: false,
          offset: [0, -10]
        })

        markersRef.current.push(marker)
        bounds.extend([listing.latitude, listing.longitude])
        hasValidCoords = true
      }
    })

    if (hasValidCoords && listings.length > 0) {
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 14 })
    }

    return () => {
      style.remove()
    }
  }, [listings])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className="h-full w-full bg-muted/20"
      style={{ zIndex: 0 }}
    />
  )
}

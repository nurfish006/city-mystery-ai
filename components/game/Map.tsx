"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

interface MapProps {
  lat: number
  lng: number
  blurLevel: number
}

export default function Map({ lat, lng, blurLevel }: MapProps) {
  useEffect(() => {
    const fixLeafletIcon = async () => {
      try {
        const L = (await import("leaflet")).default

        // @ts-ignore - Leaflet types might not be fully aware of this global cleanup
        delete L.Icon.Default.prototype._getIconUrl

        L.Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })
      } catch (error) {
        console.error("Failed to fix Leaflet icon:", error)
      }
    }

    fixLeafletIcon()
  }, [])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border">
      <div
        className="w-full h-full transition-all duration-1000 ease-in-out"
        style={{ filter: `blur(${blurLevel}px)` }}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
          zoomControl={false}
          dragging={false}
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {blurLevel === 0 && <Marker position={[lat, lng]} />}
          <MapUpdater center={[lat, lng]} zoom={12} />
        </MapContainer>
      </div>

      {blurLevel > 0 && <div className="absolute inset-0 z-[1000] bg-transparent" />}
    </div>
  )
}

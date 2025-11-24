"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-lg" />,
})

interface MapPreviewProps {
  lat: number
  lng: number
  blurLevel: number
}

export function MapPreview({ lat, lng, blurLevel }: MapPreviewProps) {
  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-lg shadow-inner bg-muted">
      <Map lat={lat} lng={lng} blurLevel={blurLevel} />
    </div>
  )
}

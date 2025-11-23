'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export function MapPreview() {
  const { gameState } = useGameStore()
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gameState || !mapContainerRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    const initializeMap = async () => {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      // Clear existing map
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = ''
      }

      // Initialize map
      const map = L.map(mapContainerRef.current).setView(
        [gameState.mapCenter.lat, gameState.mapCenter.lng],
        3
      )

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 10,
        minZoom: 2
      }).addTo(map)

      // Add blur overlay based on reveal state
      const blurOverlay = L.rectangle(
        map.getBounds(),
        {
          color: 'none',
          fillColor: 'white',
          fillOpacity: gameState.mapReveal.blurIntensity / 10,
          className: 'map-blur-overlay'
        }
      ).addTo(map)

      // Cleanup function
      return () => {
        map.remove()
      }
    }

    initializeMap()
  }, [gameState])

  if (!gameState) {
    return (
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Geographical Clue</h3>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            {gameState.mapReveal.revealPercentage}% Revealed
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
            Blur: {gameState.mapReveal.blurIntensity}/10
          </span>
        </div>
      </div>

      <div 
        ref={mapContainerRef}
        className="h-64 w-full rounded-lg border border-gray-300"
      />

      <div className="mt-3 text-sm text-gray-600">
        <p>
          💡 <strong>Map Tip:</strong> The map becomes clearer with each clue. 
          {gameState.mapReveal.blurIntensity > 5 ? ' Look for continent shapes and major geographical features.' : 
           gameState.mapReveal.blurIntensity > 2 ? ' Can you identify the region or country?' : 
           ' Almost clear! Focus on specific landmarks.'}
        </p>
      </div>
    </div>
  )
}
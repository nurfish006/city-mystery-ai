'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export function MapPreview() {
  const { gameState } = useGameStore()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [mapError, setMapError] = useState<string>('')

  useEffect(() => {
    // Only initialize if we have game state and container
    if (!gameState || !mapContainerRef.current) return

    let map: any = null

    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet')
        
        // Fix for default marker icons
        delete (L as any).Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        // Clear existing map content but keep container
        if (mapContainerRef.current) {
          // Remove any existing map but keep the container element
          const container = mapContainerRef.current
          container.innerHTML = ''
        }

        // Initialize map
        map = L.map(mapContainerRef.current).setView(
          [gameState.mapCenter.lat, gameState.mapCenter.lng],
          5
        )

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map)

        // Store map reference
        mapRef.current = map

        // Add actual city marker (only if revealed or game won)
        if (gameState.isGameWon || gameState.mapReveal.isFullyRevealed) {
          L.marker([
            gameState.targetCity.coordinates.lat, 
            gameState.targetCity.coordinates.lng
          ])
            .addTo(map)
            .bindPopup(`<b>${gameState.targetCity.name}</b><br>Correct location!`)
        }

        // Create blur effect using multiple techniques
        createBlurEffect(L, map, gameState.mapReveal.blurIntensity)

        setMapError('')

      } catch (error) {
        console.error('Failed to initialize map:', error)
        setMapError('Failed to load map.')
      }
    }

    // Helper function to create blur effect
    const createBlurEffect = (L: any, map: any, blurIntensity: number) => {
      if (blurIntensity <= 0) return

      // Method 1: Semi-transparent white overlay
      const bounds = map.getBounds()
      const overlay = L.rectangle(bounds, {
        color: 'white',
        fillColor: 'white',
        fillOpacity: blurIntensity / 15, // Adjust opacity based on blur intensity
        weight: 0,
        className: 'blur-overlay'
      }).addTo(map)

      // Method 2: Add CSS blur filter to the map container
      if (mapContainerRef.current) {
        const mapElement = mapContainerRef.current.querySelector('.leaflet-layer') 
        if (mapElement) {
          mapElement.style.filter = `blur(${blurIntensity}px)`
        }
      }
    }

    initializeMap()

    // Cleanup function - remove map when component unmounts or gameState changes
    return () => {
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [gameState]) // Only re-run when gameState changes

  // Show loading state
  if (!gameState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-500">Initialize game to see map...</p>
        </div>
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
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
            Clue {gameState.currentClueIndex + 1}/{gameState.targetCity.clues.length}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="h-64 w-full rounded-lg border border-gray-300 relative"
      >
        {/* Fallback loading state */}
        {!mapRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      {mapError && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {mapError}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-600">
        <p className="mb-2">
          💡 <strong>Map Tip:</strong> {getMapTip(gameState.mapReveal.blurIntensity)}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Red dot shows actual city location when revealed</span>
        </div>
      </div>
    </div>
  )
}

// Helper function for map tips
function getMapTip(blurIntensity: number): string {
  if (blurIntensity >= 8) return 'The map is heavily obscured. Look for continent outlines and major coastlines.'
  if (blurIntensity >= 5) return 'Features are becoming clearer. Can you identify the region or country shape?'
  if (blurIntensity >= 2) return 'Details are emerging. Look for specific geographical features and city patterns.'
  return 'The map is almost clear! Focus on specific landmarks and urban areas.'
}
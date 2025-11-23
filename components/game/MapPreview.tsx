'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import dynamic from 'next/dynamic'

// Dynamically import React-Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

export function MapPreview() {
  const { gameState } = useGameStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render on server
  if (!isClient || !gameState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
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
        </div>
      </div>

      <div className="h-64 w-full rounded-lg border border-gray-300 relative overflow-hidden">
        <MapContainer
          center={[gameState.mapCenter.lat, gameState.mapCenter.lng]}
          zoom={5}
          style={{ 
            height: '100%', 
            width: '100%', 
            filter: `blur(${gameState.mapReveal.blurIntensity}px)`, // Apply blur directly to map
            transition: 'filter 0.3s ease-in-out'
          }}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Show marker only when game is won or fully revealed */}
          {(gameState.isGameWon || gameState.mapReveal.isFullyRevealed) && (
            <Marker position={[gameState.targetCity.coordinates.lat, gameState.targetCity.coordinates.lng]}>
              <Popup>
                <b>{gameState.targetCity.name}</b>
                <br />
                Correct location!
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        {/* Semi-transparent overlay to enhance blur effect */}
        {gameState.mapReveal.blurIntensity > 0 && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${gameState.mapReveal.blurIntensity / 30})`,
              mixBlendMode: 'overlay',
              borderRadius: '0.5rem'
            }}
          />
        )}
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>
          💡 <strong>Map Tip:</strong> {getMapTip(gameState.mapReveal.blurIntensity)}
        </p>
      </div>
    </div>
  )
}

function getMapTip(blurIntensity: number): string {
  if (blurIntensity >= 8) return 'The map is heavily obscured. Look for continent outlines.'
  if (blurIntensity >= 5) return 'Features are becoming clearer. Can you identify the region?'
  if (blurIntensity >= 2) return 'Details are emerging. Look for specific geographical features.'
  return 'The map is clear! Focus on specific landmarks and urban areas.'
}
'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import dynamic from 'next/dynamic'

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

  // Calculate blur amount - convert intensity (0-10) to pixels (0px-20px)
  const getBlurAmount = (intensity: number) => {
    return (intensity * 2) + 'px'
  }

  if (!isClient || !gameState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-500">Initialize game to see map...</p>
        </div>
      </div>
    )
  }

  const blurAmount = getBlurAmount(gameState.mapReveal.blurIntensity)

  console.log('🗺️ MapPreview rendering:', {
    blurIntensity: gameState.mapReveal.blurIntensity,
    blurAmount,
    clueIndex: gameState.currentClueIndex
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Geographical Clue</h3>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            Clue {gameState.currentClueIndex + 1}/{gameState.targetCity.clues.length + 1}
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
            Blur: {gameState.mapReveal.blurIntensity}/10
          </span>
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
            {gameState.mapReveal.revealPercentage}% Visible
          </span>
        </div>
      </div>

      <div className="h-64 w-full rounded-lg border border-gray-300 relative overflow-hidden">
        {/* Map with direct CSS filter blur */}
        <div 
          className="w-full h-full"
          style={{
            filter: `blur(${blurAmount})`,
            transition: 'filter 0.5s ease-in-out'
          }}
        >
          <MapContainer
            center={[gameState.mapCenter.lat, gameState.mapCenter.lng]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="map-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
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
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>
          💡 <strong>Progress:</strong> {getProgressDescription(gameState.currentClueIndex, gameState.targetCity.clues.length)}
        </p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(gameState.currentClueIndex / gameState.targetCity.clues.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}

function getProgressDescription(currentClue: number, totalClues: number): string {
  const progress = currentClue / totalClues
  if (progress === 0) return 'Start - Map is completely obscured'
  if (progress <= 0.25) return 'Getting first clues - Very blurry'
  if (progress <= 0.5) return 'Halfway there - Starting to clear up'
  if (progress <= 0.75) return 'Almost clear - Details emerging'
  return 'Final clues - Map is nearly clear!'
}
export interface Coordinates {
  lat: number
  lng: number
}

/**
 * Calculate distance between two coordinates (simplified)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Check if coordinates are within a certain radius
 */
export function isWithinRadius(center: Coordinates, point: Coordinates, radiusKm: number): boolean {
  return calculateDistance(center, point) <= radiusKm
}

/**
 * Convert degrees to radians
 */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180)
}
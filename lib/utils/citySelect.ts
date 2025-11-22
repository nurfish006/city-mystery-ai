import worldCities from '@/data/world/cities.json'

export interface City {
  name: string
  country: string
  continent: string
  coordinates: { lat: number; lng: number }
  clues: string[]
  hints: string[]
}

export function getRandomCity(): City {
  const cities: City[] = worldCities.cities
  const randomIndex = Math.floor(Math.random() * cities.length)
  return cities[randomIndex]
}

export function getAllCities(): City[] {
  return worldCities.cities
}
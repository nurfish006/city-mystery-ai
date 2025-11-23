export interface MapConfig {
  initialZoom: number
  maxZoom: number
  minZoom: number
  blurLevels: number[] // Blur intensity for each clue level (0-10)
  revealPercentages: number[] // How much map reveals with each clue (0-100)
}

export const MAP_CONFIG: MapConfig = {
  initialZoom: 3,
  maxZoom: 10,
  minZoom: 2,
  blurLevels: [8, 6, 3, 0], // Start very blurry, end clear
  revealPercentages: [25, 50, 75, 100] // How much map reveals per clue
}

export const MAP_STYLES = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
}
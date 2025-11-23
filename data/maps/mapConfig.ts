export interface MapConfig {
  initialZoom: number
  maxZoom: number
  minZoom: number
  blurLevels: number[]
  revealPercentages: number[]
}

export const MAP_CONFIG: MapConfig = {
  initialZoom: 3,
  maxZoom: 10,
  minZoom: 2,
  // For 4 clues total: [start, clue1, clue2, clue3, clue4]
  blurLevels: [10, 8, 5, 2, 0],
  revealPercentages: [0, 25, 50, 75, 100]
}

export const MAP_STYLES = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
}
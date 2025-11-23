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
  // Index mapping:
  // 0 = Start (before first clue) - Not used anymore
  // 1 = After 1st clue (free) - Heavy blur
  // 2 = After 2nd clue - Medium blur  
  // 3 = After 3rd clue - Light blur
  // 4 = After 4th clue - Clear
  blurLevels: [10, 5, 2, 0],
  revealPercentages: [25, 50, 75, 100]
}

export const MAP_STYLES = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
}
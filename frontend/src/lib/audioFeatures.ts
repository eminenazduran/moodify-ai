import type { AudioFeatures, MoodName } from '@/types'

export const AUDIO_FEATURE_KEYS = [
  'danceability',
  'energy',
  'valence',
  'acousticness',
  'speechiness',
  'instrumentalness',
  'tempo',
] as const satisfies readonly (keyof AudioFeatures)[]

export const AUDIO_FEATURE_LABELS: Record<keyof AudioFeatures, string> = {
  danceability: 'Danceability',
  energy: 'Energy',
  valence: 'Valence',
  acousticness: 'Acousticness',
  speechiness: 'Speechiness',
  instrumentalness: 'Instrumentalness',
  tempo: 'Tempo (BPM)',
}

export const MOOD_COLORS: Record<MoodName, string> = {
  'Energetic & Dance': '#f97316',
  'Dark & Intense': '#8b5cf6',
  'Calm & Acoustic': '#22d3ee',
  'Speech-Heavy': '#eab308',
}

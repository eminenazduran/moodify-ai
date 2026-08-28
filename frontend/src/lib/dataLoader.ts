import type {
  DashboardAggregates,
  RecommendationsMap,
  Track,
} from '@/types'

const DATA_BASE = '/data'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${DATA_BASE}/${path}`)

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

/** Swap this module for an API client when a backend is added. */
export async function loadTracks(): Promise<Track[]> {
  return fetchJson<Track[]>('tracks.json')
}

export async function loadRecommendations(): Promise<RecommendationsMap> {
  return fetchJson<RecommendationsMap>('recommendations.json')
}

export async function loadAggregates(): Promise<DashboardAggregates> {
  return fetchJson<DashboardAggregates>('aggregates.json')
}

export async function loadDashboardData() {
  const [tracks, recommendations, aggregates] = await Promise.all([
    loadTracks(),
    loadRecommendations(),
    loadAggregates(),
  ])

  return { tracks, recommendations, aggregates }
}

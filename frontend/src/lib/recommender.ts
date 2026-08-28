import type { AudioFeatures, Recommendation, Track } from '@/types'

const FEATURE_WEIGHTS: Record<keyof AudioFeatures, number> = {
  danceability: 1.2,
  energy: 1.2,
  valence: 1.0,
  acousticness: 1.0,
  speechiness: 0.8,
  instrumentalness: 0.8,
  tempo: 0.6,
}

function getFeatureVector(f: AudioFeatures): number[] {
  return [
    f.danceability * FEATURE_WEIGHTS.danceability,
    f.energy * FEATURE_WEIGHTS.energy,
    f.valence * FEATURE_WEIGHTS.valence,
    f.acousticness * FEATURE_WEIGHTS.acousticness,
    f.speechiness * FEATURE_WEIGHTS.speechiness,
    f.instrumentalness * FEATURE_WEIGHTS.instrumentalness,
    // Tempo normalizasyonu (ortalama 50-200 BPM aralığı için ~0-1 ölçeği)
    (Math.min(Math.max(f.tempo, 50), 200) / 200) * FEATURE_WEIGHTS.tempo,
  ]
}

export function calculateCosineSimilarity(v1: number[], v2: number[]): number {
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i]
    norm1 += v1[i] * v1[i]
    norm2 += v2[i] * v2[i]
  }

  if (norm1 === 0 || norm2 === 0) return 0
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
}

export type RecommendedTrackItem = {
  track: Track
  similarity: number
  isPrecomputed: boolean
}

export function getTopRecommendations(
  sourceTrack: Track,
  allTracks: Track[],
  precomputedList?: Recommendation[],
  limit = 10,
): RecommendedTrackItem[] {
  const tracksById = new Map<string, Track>(allTracks.map((t) => [t.id, t]))
  const results: RecommendedTrackItem[] = []
  const usedIds = new Set<string>([sourceTrack.id])

  // 1. Önce varsa önceden hesaplanmış model önerilerini al
  if (precomputedList && precomputedList.length > 0) {
    for (const item of precomputedList) {
      const track = tracksById.get(item.track_id)
      if (track && !usedIds.has(track.id)) {
        results.push({
          track,
          similarity: item.similarity,
          isPrecomputed: true,
        })
        usedIds.add(track.id)
      }
    }
  }

  // 2. Eğer yeterli öneri yoksa (veya precomputed boşsa), client-side Cosine Similarity hesapla
  if (results.length < limit) {
    const sourceVec = getFeatureVector(sourceTrack.features)
    const candidates: RecommendedTrackItem[] = []

    for (const track of allTracks) {
      if (usedIds.has(track.id)) continue
      const targetVec = getFeatureVector(track.features)
      const sim = calculateCosineSimilarity(sourceVec, targetVec)

      candidates.push({
        track,
        similarity: Math.round(sim * 1000) / 1000,
        isPrecomputed: false,
      })
    }

    candidates.sort((a, b) => b.similarity - a.similarity)
    const needed = limit - results.length
    results.push(...candidates.slice(0, needed))
  }

  return results.slice(0, limit)
}

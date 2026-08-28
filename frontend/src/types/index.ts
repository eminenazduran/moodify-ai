/** Audio features used across clustering, classification, and recommendations */
export type AudioFeatures = {
  danceability: number
  energy: number
  valence: number
  acousticness: number
  speechiness: number
  instrumentalness: number
  tempo: number
}

export type MoodName =
  | 'Energetic & Dance'
  | 'Dark & Intense'
  | 'Calm & Acoustic'
  | 'Speech-Heavy'

export type GenreGroup =
  | 'Electronic/Dance'
  | 'Rock/Metal'
  | 'Acoustic/Folk'
  | 'Hip-Hop/R&B'
  | 'Pop'
  | 'Classical/Jazz/World'

export type Track = {
  id: string
  track_name: string
  artists: string
  track_genre: string
  mood: MoodName
  genre_group: GenreGroup
  features: AudioFeatures
}

export type Recommendation = {
  track_id: string
  similarity: number
}

/** Key = source track id, value = top-10 similar tracks */
export type RecommendationsMap = Record<string, Recommendation[]>

export type MoodStat = {
  mood: MoodName
  count: number
  percentage: number
}

export type GenreProfile = {
  genre_group: GenreGroup
  track_count: number
  features: AudioFeatures
}

export type ModelMetric = {
  model: string
  accuracy: number
  is_best?: boolean
}

export type DashboardAggregates = {
  total_tracks: number
  total_genres: number
  mood_distribution: MoodStat[]
  genre_profiles: GenreProfile[]
  model_metrics: ModelMetric[]
}

export type DashboardData = {
  tracks: Track[]
  recommendations: RecommendationsMap
  aggregates: DashboardAggregates
}

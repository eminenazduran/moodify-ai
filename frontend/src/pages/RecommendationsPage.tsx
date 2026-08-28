import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  GitCompare,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { TrackSearch } from '@/components/search/TrackSearch'
import { FeatureRadarChart } from '@/components/charts/FeatureRadarChart'
import { MoodBadge } from '@/components/cards/MoodBadge'
import { getTopRecommendations } from '@/lib/recommender'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Track } from '@/types'

export function RecommendationsPage() {
  const state = useDashboardData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [compareTrack, setCompareTrack] = useState<Track | null>(null)

  // URL'deki ?track= id parametresini veya varsayılan ilk şarkıyı seç
  useEffect(() => {
    if (state.status === 'ready' && state.data.tracks.length > 0) {
      const trackIdFromUrl = searchParams.get('track')
      if (trackIdFromUrl) {
        const found = state.data.tracks.find((t) => t.id === trackIdFromUrl)
        if (found) {
          setSelectedTrack(found)
          setCompareTrack(null)
          return
        }
      }
      if (!selectedTrack) {
        setSelectedTrack(state.data.tracks[0])
      }
    }
  }, [state, searchParams, selectedTrack])

  const handleSelectTrack = (track: Track) => {
    setSelectedTrack(track)
    setCompareTrack(null)
    setSearchParams({ track: track.id })
  }

  // Önerileri hesapla (precomputed + cosine similarity)
  const recommendations = useMemo(() => {
    if (state.status !== 'ready' || !selectedTrack) return []

    const precomputed = state.data.recommendations[selectedTrack.id]
    return getTopRecommendations(
      selectedTrack,
      state.data.tracks,
      precomputed,
      10,
    )
  }, [state, selectedTrack])

  if (state.status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p>Öneri motoru ve şarkı verileri yükleniyor…</p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
        <p className="font-semibold">Veri yükleme hatası</p>
        <p className="mt-1 text-sm">{state.message}</p>
      </div>
    )
  }

  const { tracks } = state.data
  const activeTrack = selectedTrack || tracks[0]

  return (
    <div className="space-y-8">
      {/* Başlık ve Açıklama */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="size-4" />
          <span>Cosine Similarity & Audio Feature Matching</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Şarkı Öneri Motoru (Recommendation Engine)
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Seçilen kaynak şarkının 7 boyutlu Spotify ses öznitelik vektörü ile
          veri setindeki diğer şarkılar arasındaki Cosine Benzerliği (Cosine Similarity)
          hesaplanır. En yakın akustik profile sahip benzer parçalar listelenir.
        </p>
      </div>

      {/* Arama & Hızlı Şarkı Seçimi */}
      <div className="space-y-3">
        <TrackSearch
          tracks={tracks}
          selectedTrack={activeTrack}
          onSelectTrack={handleSelectTrack}
        />

        {/* Hızlı Örnek Şarkı Butonları */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="shrink-0 text-muted-foreground">Hızlı Seçim:</span>
          {tracks.slice(0, 5).map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => handleSelectTrack(track)}
              className={`shrink-0 rounded-full px-3 py-1 font-medium transition ${
                activeTrack?.id === track.id
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border/70 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {track.track_name} — {track.artists}
            </button>
          ))}
        </div>
      </div>

      {/* Ana Bölüm: Kaynak Şarkı & Radar Görselleştirme + Öneri Kartları */}
      {activeTrack && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sol Kolon: Kaynak Şarkı Profili & Radar Karşılaştırma Grafiği */}
          <div className="space-y-6 lg:col-span-5">
            {/* Kaynak Şarkı Kartı */}
            <Card className="border-primary/40 bg-gradient-to-br from-card via-card/80 to-primary/5">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      Kaynak Şarkı (Hedef)
                    </span>
                    <CardTitle className="mt-1 text-xl">
                      {activeTrack.track_name}
                    </CardTitle>
                    <CardDescription className="text-sm text-foreground/80 font-medium">
                      {activeTrack.artists}
                    </CardDescription>
                  </div>
                  <MoodBadge mood={activeTrack.mood} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-muted/40 p-2.5">
                    <span className="text-muted-foreground">Tür:</span>
                    <p className="font-semibold capitalize text-foreground">
                      {activeTrack.track_genre}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2.5">
                    <span className="text-muted-foreground">Üst Kategori:</span>
                    <p className="font-semibold text-foreground">
                      {activeTrack.genre_group}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2.5">
                    <span className="text-muted-foreground">Tempo:</span>
                    <p className="font-semibold text-foreground">
                      {Math.round(activeTrack.features.tempo)} BPM
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2.5">
                    <span className="text-muted-foreground">Mood Kümesi:</span>
                    <p className="font-semibold text-foreground">
                      {activeTrack.mood}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Radar Ses Öznitelikleri Grafiği */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Ses Profili Karşılaştırması
                    </CardTitle>
                    <CardDescription>
                      {compareTrack
                        ? `${activeTrack.track_name} vs ${compareTrack.track_name}`
                        : '6 Boyutlu Spotify Audio Feature Vektörü'}
                    </CardDescription>
                  </div>
                  {compareTrack && (
                    <button
                      type="button"
                      onClick={() => setCompareTrack(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <FeatureRadarChart
                  sourceTrack={activeTrack}
                  compareTrack={compareTrack}
                />
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  Öneri kartlarındaki <GitCompare className="inline size-3 text-primary" /> butonuna
                  tıklayarak grafikte yan yana karşılaştırabilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Kolon: Top 10 Öneri Listesi */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="size-5 text-primary" />
                      <span>En Benzer Şarkılar (Top-{recommendations.length})</span>
                    </CardTitle>
                    <CardDescription>
                      Cosine Similarity skoruna göre sıralanmış en yakın şarkılar
                    </CardDescription>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {recommendations.length} Öneri
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((item, index) => {
                  const isComparing = compareTrack?.id === item.track.id
                  const isSameMood = item.track.mood === activeTrack.mood
                  const similarityPct = Math.round(item.similarity * 100)

                  return (
                    <div
                      key={item.track.id}
                      className={`group rounded-xl border p-4 transition-all ${
                        isComparing
                          ? 'border-cyan-500/80 bg-cyan-950/20 shadow-md ring-1 ring-cyan-500/50'
                          : 'border-border/60 bg-card/40 hover:border-primary/40 hover:bg-muted/20'
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Sıra Numarası ve Şarkı Bilgisi */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            #{index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-foreground">
                              {item.track.track_name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.track.artists} ·{' '}
                              <span className="capitalize">
                                {item.track.track_genre}
                              </span>{' '}
                              ({item.track.genre_group})
                            </p>
                          </div>
                        </div>

                        {/* Benzerlik Skoru ve Aksiyonlar */}
                        <div className="flex shrink-0 items-center gap-2">
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-primary/30">
                              %{similarityPct} Eşleşme
                            </span>
                            <p className="text-[10px] text-muted-foreground">
                              {isSameMood ? 'Aynı Mood' : 'Farklı Mood'}
                            </p>
                          </div>

                          {/* Karşılaştır Butonu */}
                          <button
                            type="button"
                            onClick={() =>
                              setCompareTrack(isComparing ? null : item.track)
                            }
                            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                              isComparing
                                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                                : 'border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                            }`}
                            title="Radar grafiğinde karşılaştır"
                          >
                            <GitCompare className="size-3.5" />
                            <span className="hidden sm:inline">
                              {isComparing ? 'Seçili' : 'Kıyasla'}
                            </span>
                          </button>

                          {/* Bu Şarkıyı Seç (Zincirleme Öneri) Butonu */}
                          <button
                            type="button"
                            onClick={() => handleSelectTrack(item.track)}
                            className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
                            title="Bu şarkı için yeni öneriler al"
                          >
                            <span>Öner</span>
                            <ArrowRight className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Mini Ses Özellikleri Karşılaştırma Çubukları */}
                      <div className="mt-3 grid grid-cols-4 gap-2 border-t border-border/40 pt-2.5 text-[10px]">
                        <div>
                          <span className="text-muted-foreground">Dans: </span>
                          <span className="font-semibold text-foreground">
                            {Math.round(item.track.features.danceability * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Enerji: </span>
                          <span className="font-semibold text-foreground">
                            {Math.round(item.track.features.energy * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valans: </span>
                          <span className="font-semibold text-foreground">
                            {Math.round(item.track.features.valence * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Akustik: </span>
                          <span className="font-semibold text-foreground">
                            {Math.round(item.track.features.acousticness * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

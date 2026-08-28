import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BarChart3,
  Layers3,
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { MoodBadge } from '@/components/cards/MoodBadge'
import {
  AUDIO_FEATURE_KEYS,
  AUDIO_FEATURE_LABELS,
} from '@/lib/audioFeatures'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { AudioFeatures, GenreGroup } from '@/types'

const GENRE_COLORS: Record<GenreGroup, string> = {
  Pop: '#ec4899',
  'Rock/Metal': '#ef4444',
  'Hip-Hop/R&B': '#eab308',
  'Electronic/Dance': '#8b5cf6',
  'Acoustic/Folk': '#10b981',
  'Classical/Jazz/World': '#3b82f6',
}

export function GenreInsightsPage() {
  const state = useDashboardData()
  const [selectedFeature, setSelectedFeature] =
    useState<keyof AudioFeatures>('danceability')
  const [selectedGenre, setSelectedGenre] = useState<GenreGroup | null>(null)

  if (state.status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p>Tür analiz verileri yükleniyor…</p>
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

  const { aggregates, tracks } = state.data
  const { genre_profiles, total_tracks } = aggregates

  // Seçili özniteliğe göre sıralı grafik verisi
  const chartData = [...genre_profiles]
    .map((profile) => ({
      genre_group: profile.genre_group,
      value:
        selectedFeature === 'tempo'
          ? Math.round(profile.features[selectedFeature])
          : Math.round(profile.features[selectedFeature] * 100),
      rawVal: profile.features[selectedFeature],
      track_count: profile.track_count,
    }))
    .sort((a, b) => b.value - a.value)

  // Seçili türün şarkılarını filtrele
  const genreTracks = selectedGenre
    ? tracks.filter((t) => t.genre_group === selectedGenre)
    : []

  return (
    <div className="space-y-8">
      {/* Başlık ve Açıklama */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Layers3 className="size-4" />
          <span>Keşifçi Veri Analizi (Exploratory Data Analysis - EDA)</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Müzik Tür Grupları & Ses Profili Analizi
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          114 Spotify alt türü 6 ana üst kategoride toplanmıştır. Her tür
          grubunun akustik karakteristiğini (enerji, valans, dans edilebilirlik vb.)
          karşılaştırabilir ve türler arasındaki ayırt edici öznitelikleri
          inceleyebilirsiniz.
        </p>
      </div>

      {/* Ses Özniteliği Seçici Butonları */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Karşılaştırılacak Ses Özniteliği:
          </span>
          <span className="text-xs text-muted-foreground">
            Aktif Öznitelik: <strong className="text-foreground">{AUDIO_FEATURE_LABELS[selectedFeature]}</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {AUDIO_FEATURE_KEYS.map((key) => {
            const isSelected = selectedFeature === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFeature(key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border/70 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {AUDIO_FEATURE_LABELS[key]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Karşılaştırma Grafiği */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                <span>Tür Gruplarında {AUDIO_FEATURE_LABELS[selectedFeature]} Ortalamaları</span>
              </CardTitle>
              <CardDescription>
                {selectedFeature === 'tempo'
                  ? 'Birim: BPM (Vuruş/Dakika)'
                  : 'Birim: Normalleştirilmiş Yüzde (% 0–100)'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis
                  dataKey="genre_group"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  domain={selectedFeature === 'tempo' ? [60, 150] : [0, 100]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null
                    const item = payload[0].payload as {
                      genre_group: GenreGroup
                      value: number
                      track_count: number
                    }
                    const color = GENRE_COLORS[item.genre_group]
                    return (
                      <div className="rounded-lg border border-border/80 bg-card/95 p-3 text-xs shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span>{item.genre_group}</span>
                        </div>
                        <div className="mt-1.5 space-y-1 text-muted-foreground">
                          <p>
                            {AUDIO_FEATURE_LABELS[selectedFeature]}:{' '}
                            <strong className="text-foreground">
                              {item.value}
                              {selectedFeature === 'tempo' ? ' BPM' : '%'}
                            </strong>
                          </p>
                          <p>
                            Şarkı Sayısı:{' '}
                            <span className="text-foreground">
                              {item.track_count.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.genre_group}`}
                      fill={GENRE_COLORS[entry.genre_group]}
                      opacity={selectedGenre && selectedGenre !== entry.genre_group ? 0.35 : 0.9}
                      className="cursor-pointer transition-opacity"
                      onClick={() =>
                        setSelectedGenre(
                          selectedGenre === entry.genre_group ? null : entry.genre_group,
                        )
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Grafik çubuklarına veya aşağıdaki kartlara tıklayarak o türe ait örnek şarkıları filtreleyebilirsiniz.
          </p>
        </CardContent>
      </Card>

      {/* 6 Tür Grubu Kartları */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Tür Grupları Profilleri & Veri Dağılımı
          </h2>
          {selectedGenre && (
            <button
              type="button"
              onClick={() => setSelectedGenre(null)}
              className="text-xs text-primary hover:underline"
            >
              Filtreyi Temizle (Tümünü Göster)
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genre_profiles.map((profile) => {
            const isSelected = selectedGenre === profile.genre_group
            const color = GENRE_COLORS[profile.genre_group]
            const percentage = Math.round((profile.track_count / total_tracks) * 100)

            return (
              <Card
                key={profile.genre_group}
                onClick={() =>
                  setSelectedGenre(isSelected ? null : profile.genre_group)
                }
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary shadow-lg ring-1 ring-primary/40 bg-card/90'
                    : 'border-border/60 hover:border-primary/40 hover:bg-card/70'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <CardTitle className="text-base">
                          {profile.genre_group}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        %{percentage} pay · {profile.track_count.toLocaleString()} şarkı
                      </CardDescription>
                    </div>
                    {isSelected && (
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Seçili
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {/* Önemli öznitelikler mini çubuklar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-muted-foreground text-[11px]">
                      <span>Dans Edilebilirlik</span>
                      <span className="font-semibold text-foreground">
                        %{Math.round(profile.features.danceability * 100)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${profile.features.danceability * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-muted-foreground text-[11px]">
                      <span>Enerji</span>
                      <span className="font-semibold text-foreground">
                        %{Math.round(profile.features.energy * 100)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-red-400"
                        style={{ width: `${profile.features.energy * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-muted-foreground text-[11px]">
                      <span>Akustiklik</span>
                      <span className="font-semibold text-foreground">
                        %{Math.round(profile.features.acousticness * 100)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${profile.features.acousticness * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Seçili Tür Grubu Şarkıları */}
      {selectedGenre && (
        <Card className="border-primary/40 bg-card/60">
          <CardHeader>
            <CardTitle className="text-base">
              {selectedGenre} Örnek Şarkıları ({genreTracks.length})
            </CardTitle>
            <CardDescription>
              Bu kategoriye dahil olan demo veri setindeki parçalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {genreTracks.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Bu türe ait örnek şarkı bulunamadı.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {genreTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/50 p-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">
                        {track.track_name}
                      </p>
                      <p className="truncate text-muted-foreground">
                        {track.artists} · <span className="capitalize">{track.track_genre}</span>
                      </p>
                    </div>
                    <MoodBadge mood={track.mood} className="text-[10px]" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

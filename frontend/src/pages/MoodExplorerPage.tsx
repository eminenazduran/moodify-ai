import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Disc3,
  Filter,
  Info,
  Volume2,
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { MoodDonutChart } from '@/components/charts/MoodDonutChart'
import { MoodBadge } from '@/components/cards/MoodBadge'
import { MOOD_COLORS } from '@/lib/audioFeatures'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { MoodName } from '@/types'

const MOOD_DESCRIPTIONS: Record<
  MoodName,
  { summary: string; characteristics: string; topGenres: string }
> = {
  'Energetic & Dance': {
    summary: 'Yüksek ritim, belirgin tempo ve yüksek enerjiye sahip hareketli şarkılar.',
    characteristics: 'Danceability > 0.7, Energy > 0.75, yüksek tempo',
    topGenres: 'Pop, House, EDM, Dance-Pop, Disco',
  },
  'Dark & Intense': {
    summary: 'Yüksek enerji ve distorsiyon, ancak daha düşük valans (karanlık/agresif his).',
    characteristics: 'Energy > 0.8, Valence < 0.45, düşük akustiklik',
    topGenres: 'Metal, Hard Rock, Nu-Metal, Dark Synth',
  },
  'Calm & Acoustic': {
    summary: 'Yüksek akustiklik, yumuşak dinamikler, düşük tempo ve sakin tınılar.',
    characteristics: 'Acousticness > 0.65, Energy < 0.4, düşük tempo',
    topGenres: 'Folk, Acoustic, Indie, Classical, Ambient',
  },
  'Speech-Heavy': {
    summary: 'Vokal ve söz yoğunluğunun öne çıktığı ritmik hip-hop ve trap parçaları.',
    characteristics: 'Speechiness > 0.10, orta/yüksek dans edilebilirlik',
    topGenres: 'Hip-Hop, Rap, Trap, Spoken Word',
  },
}

export function MoodExplorerPage() {
  const state = useDashboardData()
  const [selectedMood, setSelectedMood] = useState<MoodName | null>(null)

  if (state.status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p>Mood analiz verileri yükleniyor…</p>
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

  const filteredTracks = selectedMood
    ? tracks.filter((t) => t.mood === selectedMood)
    : tracks

  return (
    <div className="space-y-8">
      {/* Sayfa Başlığı ve Açıklama */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Disc3 className="size-4" />
          <span>Denetimsiz Öğrenme (Unsupervised Learning)</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Mood Explorer — K-Means Kümeleme Analizi
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Spotify audio feature vektörleri üzerinde eğitilen K-Means (k=4)
          algoritması, 114.000 şarkıyı 4 temel ruh haline gruplamıştır. Aşağıdaki
          grafikten veya filtrelerden bir mood seçerek şarkı profillerini inceleyebilirsiniz.
        </p>
      </div>

      {/* Mood Filtre Butonları */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedMood(null)}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
            selectedMood === null
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border border-border/70 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Filter className="size-3.5" />
          <span>Tüm Moodlar ({tracks.length})</span>
        </button>

        {aggregates.mood_distribution.map((item) => {
          const isSelected = selectedMood === item.mood
          const color = MOOD_COLORS[item.mood]
          return (
            <button
              key={item.mood}
              type="button"
              onClick={() => setSelectedMood(isSelected ? null : item.mood)}
              className="flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition"
              style={{
                borderColor: isSelected ? color : 'var(--border)',
                backgroundColor: isSelected ? `${color}25` : 'transparent',
                color: isSelected ? color : 'var(--foreground)',
              }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{item.mood}</span>
              <span className="opacity-70">%{item.percentage}</span>
            </button>
          )
        })}
      </div>

      {/* Ana Izgara: Grafik & Küme Açıklaması + Şarkı Listesi */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sol Kolon: Donut Chart ve Küme Detay Kartı */}
        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Mood Dağılım Grafiği</CardTitle>
              <CardDescription>
                114.000 parçalık veri setindeki oransal dağılım
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodDonutChart
                data={aggregates.mood_distribution}
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
              />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Dilimlere tıklayarak listeyi filtreleyebilirsiniz.
              </p>
            </CardContent>
          </Card>

          {/* Seçili veya Genel Mood Bilgilendirme Kartı */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <CardTitle className="text-base">
                  {selectedMood ? selectedMood : 'K-Means Kümeleme Özeti'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              {selectedMood ? (
                <>
                  <p className="text-foreground">
                    {MOOD_DESCRIPTIONS[selectedMood].summary}
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 ring-1 ring-border/40">
                    <p>
                      <strong className="text-foreground">Öne Çıkan Özellikler:</strong>{' '}
                      {MOOD_DESCRIPTIONS[selectedMood].characteristics}
                    </p>
                    <p>
                      <strong className="text-foreground">Baskın Türler:</strong>{' '}
                      {MOOD_DESCRIPTIONS[selectedMood].topGenres}
                    </p>
                  </div>
                </>
              ) : (
                <p>
                  Model; danceability, energy, valence, acousticness, speechiness,
                  instrumentalness ve tempo olmak üzere 7 standartlaştırılmış öznitelik
                  üzerinde optimize edilmiştir. Yukarıdan bir küme seçerek detaylarını
                  inceleyebilirsiniz.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon: Örnek Şarkılar Listesi */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedMood ? `${selectedMood} Parçaları` : 'Yüklü Şarkılar'} (
                    {filteredTracks.length})
                  </CardTitle>
                  <CardDescription>
                    Her parçanın tespit edilen ruh hali ve temel ses öznitelikleri
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTracks.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Bu ruh haline ait örnek şarkı bulunamadı.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTracks.map((track) => (
                    <div
                      key={track.id}
                      className="group rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-primary/40 hover:bg-muted/20"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Volume2 className="size-4 shrink-0 text-primary" />
                            <h3 className="truncate font-semibold text-foreground">
                              {track.track_name}
                            </h3>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {track.artists} · <span className="capitalize">{track.track_genre}</span> ({track.genre_group})
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <MoodBadge mood={track.mood} />
                          <Link
                            to={`/recommend?track=${track.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                          >
                            <span>Öneriler</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Mini Ses Özellikleri Göstergesi */}
                      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/40 pt-3 text-[11px]">
                        <div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Dans</span>
                            <span className="font-medium text-foreground">
                              {Math.round(track.features.danceability * 100)}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${track.features.danceability * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Enerji</span>
                            <span className="font-medium text-foreground">
                              {Math.round(track.features.energy * 100)}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-orange-400"
                              style={{
                                width: `${track.features.energy * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Valans</span>
                            <span className="font-medium text-foreground">
                              {Math.round(track.features.valence * 100)}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-cyan-400"
                              style={{
                                width: `${track.features.valence * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  Disc3,
  Layers3,
  ListMusic,
  Music2,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { MoodBadge } from '@/components/cards/MoodBadge'
import { StatCard } from '@/components/cards/StatCard'
import { MOOD_COLORS } from '@/lib/audioFeatures'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const PIPELINE_STEPS = [
  {
    title: 'Mood Clustering',
    description: 'K-Means on 7 audio features → 4 behavioral mood groups',
    icon: Disc3,
    path: '/mood',
  },
  {
    title: 'Genre Classification',
    description: '114 genres mapped to 6 groups; Random Forest at 61.1% accuracy',
    icon: BrainCircuit,
    path: '/models',
  },
  {
    title: 'Recommendations',
    description: 'Cosine similarity + genre filter → top-10 similar tracks',
    icon: Music2,
    path: '/recommend',
  },
]

const KEY_AUDIO_FEATURES = [
  {
    name: 'Danceability',
    desc: 'Tempo, ritim kararlılığı ve vuruş gücüne dayalı dans edilebilirlik ölçüsü (0.0 - 1.0).',
  },
  {
    name: 'Energy',
    desc: 'Dinamik aralık, algılanan ses yüksekliği ve tınısal yoğunluk ölçüsü (0.0 - 1.0).',
  },
  {
    name: 'Valence',
    desc: 'Müziğin ilettiği pozitiflik/mutluluk (yüksek) veya hüzün/öfke (düşük) tonu (0.0 - 1.0).',
  },
  {
    name: 'Acousticness',
    desc: 'Parçanın akustik enstrümanlarla kaydedilme olasılığı güven puanı (0.0 - 1.0).',
  },
]

export function HomePage() {
  const state = useDashboardData()

  if (state.status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p>Dashboard verileri yükleniyor…</p>
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
  const bestModel = aggregates.model_metrics.find((m) => m.is_best)
  const topMood = [...aggregates.mood_distribution].sort(
    (a, b) => b.percentage - a.percentage,
  )[0]

  return (
    <div className="space-y-8">
      {/* Hero / Proje Tanıtım Banner'ı */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/90 via-card/50 to-primary/5 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
              <Sparkles className="size-3.5" />
              <span>Data Science Portfolio Project</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Moodify AI — Müzik Zekası & Öneri Motoru
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Spotify Tracks veri setindeki 114.000 parça ve 7 ses özniteliği
              üzerinde eğitilmiş makine öğrenimi modelleri; denetimsiz K-Means mood
              kümeleme, Random Forest tür sınıflandırma ve Cosine Similarity tabanlı
              şarkı öneri sistemini bir araya getirir.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/recommend"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Music2 className="size-4" />
              <span>Şarkı Önerisi Al</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Ana Metrik Kartı */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Veri Seti Büyüklüğü"
          value={aggregates.total_tracks.toLocaleString()}
          description={`${tracks.length} örnek parça belleğe yüklendi`}
          icon={Music2}
        />
        <StatCard
          title="Müzik Türleri"
          value={String(aggregates.total_genres)}
          description="6 ana üst kategoriye haritalandı"
          icon={Layers3}
        />
        <StatCard
          title="Mood Kümeleri"
          value="4 Küme"
          description={`En büyük: ${topMood.mood} (%${topMood.percentage})`}
          icon={Disc3}
        />
        <StatCard
          title="En İyi ML Modeli"
          value={bestModel ? `%${(bestModel.accuracy * 100).toFixed(1)}` : '—'}
          description={bestModel?.model ?? 'Random Forest Sınıflandırıcı'}
          icon={BrainCircuit}
        />
      </section>

      {/* Mood Dağılımı ve ML Pipeline Akışı */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mood Dağılımı (K-Means)</CardTitle>
                <CardDescription>
                  114k şarkı üzerinde K=4 kümeleme sonuçları
                </CardDescription>
              </div>
              <Link
                to="/mood"
                className="text-xs font-medium text-primary hover:underline"
              >
                Detayları Gör →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {aggregates.mood_distribution.map((item) => (
              <div key={item.mood} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <MoodBadge mood={item.mood} />
                  <span className="text-sm tabular-nums text-muted-foreground">
                    %{item.percentage} · {item.count.toLocaleString()} şarkı
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: MOOD_COLORS[item.mood],
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Makine Öğrenimi Mimarisi</CardTitle>
            <CardDescription>
              Uygulamanın kalbindeki 3 temel ML aşaması
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {PIPELINE_STEPS.map(({ title, description, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className="group flex items-start gap-3.5 rounded-xl border border-border/60 p-3.5 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border/60 transition-colors group-hover:bg-primary/15 group-hover:ring-primary/30">
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {title}
                    </p>
                    <ArrowRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Alt Bölüm: Ses Öznitelikleri Sözlüğü & Yüklü Örnek Parçalar */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Ses Öznitelikleri Sözlüğü */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="size-4 text-primary" />
              <CardTitle className="text-base">Ses Öznitelikleri</CardTitle>
            </div>
            <CardDescription>
              Modellerin dinlediği temel Spotify metrikleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {KEY_AUDIO_FEATURES.map((f) => (
              <div
                key={f.name}
                className="rounded-lg bg-muted/40 p-3 text-xs ring-1 ring-border/40"
              >
                <span className="font-semibold text-foreground">{f.name}: </span>
                <span className="text-muted-foreground">{f.desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Yüklü Örnek Parça Tablosu / Listesi */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListMusic className="size-4 text-primary" />
                <div>
                  <CardTitle className="text-base">
                    Yüklü Örnek Şarkılar ({tracks.length})
                  </CardTitle>
                  <CardDescription>
                    Öneri motorunda ve mood analizinde kullanılan demo veri kümesi
                  </CardDescription>
                </div>
              </div>
              <Link
                to="/recommend"
                className="text-xs font-medium text-primary hover:underline"
              >
                Tümünü İncele →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/40 rounded-lg border border-border/50 bg-card/30">
              {tracks.slice(0, 6).map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between gap-3 p-3 text-sm transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {track.track_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {track.artists} · <span className="capitalize">{track.track_genre}</span> ({track.genre_group})
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <MoodBadge mood={track.mood} />
                    <Link
                      to={`/recommend?track=${track.id}`}
                      className="rounded-md border border-border/60 p-1.5 text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                      title="Bu şarkı için önerileri gör"
                    >
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {tracks.length > 6 && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                + {tracks.length - 6} şarkı daha yüklendi. Keşfetmek için{' '}
                <Link to="/recommend" className="text-primary hover:underline">
                  Öneri Motorunu
                </Link>{' '}
                kullanabilirsiniz.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


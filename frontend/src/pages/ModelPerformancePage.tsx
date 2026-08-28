import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Award,
  BrainCircuit,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const MODEL_DETAILS = [
  {
    model: 'Random Forest',
    type: 'Ensemble Bagging Trees (100 Estimators)',
    accuracy: 0.611,
    is_best: true,
    highlights:
      'Doğrusal olmayan ses öznitelik ilişkilerini ve özellik etkileşimlerini en iyi yakalayan model oldu. %61.1 test doğruluğu ile en yüksek skora ulaştı.',
  },
  {
    model: 'XGBoost',
    type: 'Gradient Boosted Decision Trees',
    accuracy: 0.567,
    is_best: false,
    highlights:
      'Yüksek öğrenme kapasitesi sundu, ancak akustiklik ve dans edilebilirlik gibi örtüşen sınıflarda aşırı öğrenme (overfitting) eğilimi gösterdi.',
  },
  {
    model: 'Logistic Regression',
    type: 'Linear Multi-Class (Softmax Regression)',
    accuracy: 0.464,
    is_best: false,
    highlights:
      'Doğrusal karar sınırları nedeniyle karmaşık ve çok modlu ses dağılımlarını ayırmakta yetersiz kaldı; temel referans (baseline) modeli olarak kullanıldı.',
  },
]

const FEATURE_IMPORTANCES = [
  {
    feature: 'Acousticness',
    importance: 28.4,
    desc: 'Akustik/Klasik ile Elektronik/Pop türlerini birbirinden ayıran en belirleyici öznitelik.',
  },
  {
    feature: 'Danceability',
    importance: 21.6,
    desc: 'Hip-Hop, Dans ve Pop türlerinin ritmik desenlerini belirlemede kilit rol oynadı.',
  },
  {
    feature: 'Energy',
    importance: 18.2,
    desc: 'Rock/Metal ile Sakin/Akustik parçalar arasındaki dinamik ayrımı sağladı.',
  },
  {
    feature: 'Speechiness',
    importance: 14.5,
    desc: 'Hip-Hop/Rap vokalleri ile diğer türler arasındaki söz yoğunluğunu tespit etti.',
  },
  {
    feature: 'Instrumentalness',
    importance: 9.8,
    desc: 'Vokalsiz klasik ve elektronik parçaları ayrıştırdı.',
  },
  {
    feature: 'Valence & Tempo',
    importance: 7.5,
    desc: 'Duygusal ton ve hız değişkenleri model kararlarını destekledi.',
  },
]

export function ModelPerformancePage() {
  const state = useDashboardData()

  if (state.status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p>Model performans verileri yükleniyor…</p>
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

  const { aggregates } = state.data
  const { model_metrics } = aggregates

  const chartData = model_metrics.map((m) => ({
    model: m.model,
    accuracy: Math.round(m.accuracy * 1000) / 10,
    is_best: m.is_best,
  }))

  return (
    <div className="space-y-8">
      {/* Başlık ve Açıklama */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <BrainCircuit className="size-4" />
          <span>Denetimli Öğrenme (Supervised Learning) Değerlendirmesi</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Model Performansı & Tür Sınıflandırma
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Spotify ses özniteliklerinden 6 üst müzik türü kategorisini tahmin etmek
          üzere 3 farklı sınıflandırma algoritması eğitilmiş ve çapraz doğrulama
          (cross-validation) ile test edilmiştir.
        </p>
      </div>

      {/* Ana Metrik Kartları */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/50 bg-gradient-to-br from-card to-primary/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>En Başarılı Model</CardDescription>
              <Award className="size-5 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Random Forest (%61.1)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Rastgele tahmin tabanına göre (%16.7) yaklaşık 3.7 kat daha yüksek doğruluk.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Sınıf Sayısı (Target Classes)</CardDescription>
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              6 Üst Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              114 alt tür dengelenerek 6 ana kategoriye gruplanmıştır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>En Önemli Öznitelik</CardDescription>
              <TrendingUp className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Acousticness (%28.4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gini Importance / Feature Gain analizinde en belirleyici faktör.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Model Doğruluk Grafiği ve Öznitelik Önemi */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sol Kolon: Doğruluk Karşılaştırma Grafiği */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base">Model Doğruluk Oranları (Accuracy)</CardTitle>
            <CardDescription>
              Test veri seti üzerindeki sınıflandırma başarımı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    strokeOpacity={0.4}
                  />
                  <XAxis
                    dataKey="model"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      const item = payload[0].payload as {
                        model: string
                        accuracy: number
                        is_best: boolean
                      }
                      return (
                        <div className="rounded-lg border border-border/80 bg-card/95 p-3 text-xs shadow-xl backdrop-blur-md">
                          <p className="font-bold text-foreground">
                            {item.model} {item.is_best ? '🏆 (En İyi)' : ''}
                          </p>
                          <p className="mt-1 text-muted-foreground">
                            Test Doğruluğu:{' '}
                            <strong className="text-foreground">
                              %{item.accuracy}
                            </strong>
                          </p>
                        </div>
                      )
                    }}
                  />
                  <ReferenceLine
                    y={16.7}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Rastgele Şans (%16.7)',
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'insideBottomRight',
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.model}`}
                        fill={entry.is_best ? '#22c55e' : '#64748b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Yeşil çubuk: En yüksek doğruluğa ulaşan Random Forest modeli (%61.1)
            </p>
          </CardContent>
        </Card>

        {/* Sağ Kolon: Öznitelik Önemi (Feature Importance) */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base">Öznitelik Önemi (Feature Importance)</CardTitle>
            <CardDescription>
              Random Forest modelinin karar verirken en çok ağırlık verdiği öznitelikler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {FEATURE_IMPORTANCES.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {item.feature}
                  </span>
                  <span className="font-bold text-primary">
                    %{item.importance}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${item.importance * 2.5}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Model Karşılaştırma Detay Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Model Mimarileri & Karşılaştırma Tablosu</CardTitle>
          <CardDescription>
            Tüm modellerin teknik detayları ve data science bulguları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-card/40">
            {MODEL_DETAILS.map((item) => (
              <div
                key={item.model}
                className={`p-4 transition-colors ${
                  item.is_best ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    {item.is_best ? (
                      <CheckCircle className="size-5 text-primary" />
                    ) : (
                      <span className="size-2.5 rounded-full bg-muted-foreground/50 ml-1.5" />
                    )}
                    <div>
                      <h3 className="font-bold text-foreground">
                        {item.model}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.is_best
                          ? 'bg-primary/20 text-primary ring-1 ring-primary/40'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      %{(item.accuracy * 100).toFixed(1)} Doğruluk
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {item.highlights}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

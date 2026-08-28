import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { Track } from '@/types'

type FeatureRadarChartProps = {
  sourceTrack: Track
  compareTrack?: Track | null
}

export function FeatureRadarChart({
  sourceTrack,
  compareTrack,
}: FeatureRadarChartProps) {
  const chartData = [
    {
      feature: 'Dans',
      fullName: 'Danceability',
      [sourceTrack.track_name]: Math.round(
        sourceTrack.features.danceability * 100,
      ),
      ...(compareTrack
        ? {
            [compareTrack.track_name]: Math.round(
              compareTrack.features.danceability * 100,
            ),
          }
        : {}),
    },
    {
      feature: 'Enerji',
      fullName: 'Energy',
      [sourceTrack.track_name]: Math.round(sourceTrack.features.energy * 100),
      ...(compareTrack
        ? {
            [compareTrack.track_name]: Math.round(
              compareTrack.features.energy * 100,
            ),
          }
        : {}),
    },
    {
      feature: 'Valans',
      fullName: 'Valence',
      [sourceTrack.track_name]: Math.round(sourceTrack.features.valence * 100),
      ...(compareTrack
        ? {
            [compareTrack.track_name]: Math.round(
              compareTrack.features.valence * 100,
            ),
          }
        : {}),
    },
    {
      feature: 'Akustik',
      fullName: 'Acousticness',
      [sourceTrack.track_name]: Math.round(
        sourceTrack.features.acousticness * 100,
      ),
      ...(compareTrack
        ? {
            [compareTrack.track_name]: Math.round(
              compareTrack.features.acousticness * 100,
            ),
          }
        : {}),
    },
    {
      feature: 'Konuşma',
      fullName: 'Speechiness',
      [sourceTrack.track_name]: Math.round(
        sourceTrack.features.speechiness * 100,
      ),
      ...(compareTrack
        ? {
            [compareTrack.track_name]: Math.round(
              compareTrack.features.speechiness * 100,
            ),
          }
        : {}),
    },
    {
      feature: 'Enstrüman',
      fullName: 'Instrumentalness',
      [sourceTrack.track_name]: Math.round(
        sourceTrack.features.instrumentalness * 100,
      ),
      ...(compareTrack
        ? {
            [compareTrack.track_name]: Math.round(
              compareTrack.features.instrumentalness * 100,
            ),
          }
        : {}),
    },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--border)" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="feature"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }}
            stroke="var(--border)"
            strokeOpacity={0.4}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null
              const dataPoint = payload[0].payload as {
                fullName: string
                [key: string]: string | number
              }
              return (
                <div className="rounded-lg border border-border/80 bg-card/95 p-3 text-xs shadow-xl backdrop-blur-md">
                  <p className="font-semibold text-foreground">
                    {dataPoint.fullName}
                  </p>
                  <div className="mt-1 space-y-1">
                    {payload.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between gap-3 text-muted-foreground"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="truncate max-w-[120px]">{entry.name}:</span>
                        </span>
                        <span className="font-bold text-foreground">
                          %{entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }}
          />
          <Radar
            name={sourceTrack.track_name}
            dataKey={sourceTrack.track_name}
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={compareTrack ? 0.25 : 0.45}
            strokeWidth={2}
          />
          {compareTrack && (
            <Radar
              name={compareTrack.track_name}
              dataKey={compareTrack.track_name}
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          )}
          <Legend
            wrapperStyle={{ paddingTop: 10, fontSize: '11px' }}
            formatter={(value) => (
              <span className="text-muted-foreground">{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { MOOD_COLORS } from '@/lib/audioFeatures'
import type { MoodName, MoodStat } from '@/types'

type MoodDonutChartProps = {
  data: MoodStat[]
  selectedMood: MoodName | null
  onSelectMood: (mood: MoodName | null) => void
}

export function MoodDonutChart({
  data,
  selectedMood,
  onSelectMood,
}: MoodDonutChartProps) {
  return (
    <div className="relative h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null
              const item = payload[0].payload as MoodStat
              const color = MOOD_COLORS[item.mood]

              return (
                <div className="rounded-lg border border-border/80 bg-card/95 p-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-foreground">
                      {item.mood}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                    <p className="tabular-nums">
                      <strong className="text-foreground">%{item.percentage}</strong> ({item.count.toLocaleString()} şarkı)
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                      Tıklayarak filtreleyin
                    </p>
                  </div>
                </div>
              )
            }}
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="mood"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={4}
            cursor="pointer"
            onClick={(entry) => {
              const clickedMood = (entry.payload as MoodStat)?.mood || (entry as unknown as MoodStat)?.mood
              if (clickedMood) {
                onSelectMood(selectedMood === clickedMood ? null : clickedMood)
              }
            }}
          >
            {data.map((entry) => {
              const isSelected = selectedMood === entry.mood
              const isDimmed = selectedMood !== null && !isSelected
              return (
                <Cell
                  key={`cell-${entry.mood}`}
                  fill={MOOD_COLORS[entry.mood]}
                  opacity={isDimmed ? 0.3 : 1}
                  stroke={isSelected ? '#ffffff' : 'transparent'}
                  strokeWidth={isSelected ? 2 : 0}
                  className="transition-all duration-300 outline-none"
                />
              )
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Ortadaki Özet Etiket */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {selectedMood ? 'Seçili Mood' : 'Toplam'}
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          {selectedMood
            ? `${data.find((d) => d.mood === selectedMood)?.percentage}%`
            : `${data.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}`}
        </span>
        {selectedMood && (
          <span className="text-[11px] text-muted-foreground">
            {data.find((d) => d.mood === selectedMood)?.count.toLocaleString()} şarkı
          </span>
        )}
      </div>
    </div>
  )
}

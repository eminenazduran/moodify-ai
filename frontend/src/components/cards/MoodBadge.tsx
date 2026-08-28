import { cn } from '@/lib/utils'
import { MOOD_COLORS } from '@/lib/audioFeatures'
import type { MoodName } from '@/types'

type MoodBadgeProps = {
  mood: MoodName
  className?: string
}

export function MoodBadge({ mood, className }: MoodBadgeProps) {
  const color = MOOD_COLORS[mood]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        className,
      )}
      style={{
        color,
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
      }}
    >
      {mood}
    </span>
  )
}

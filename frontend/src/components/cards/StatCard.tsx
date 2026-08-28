import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type StatCardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  accent?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = 'text-primary',
}: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{title}</CardDescription>
            <CardTitle className="mt-2 text-3xl font-semibold tracking-tight">
              {value}
            </CardTitle>
          </div>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20',
              accent,
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

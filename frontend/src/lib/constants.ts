import {
  BarChart3,
  Home,
  Music2,
  PieChart,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  description: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: Home,
    description: 'Project overview & stats',
  },
  {
    label: 'Mood Explorer',
    path: '/mood',
    icon: PieChart,
    description: '4 mood clusters',
  },
  {
    label: 'Recommendations',
    path: '/recommend',
    icon: Music2,
    description: 'Similar song finder',
  },
  {
    label: 'Genre Insights',
    path: '/genre',
    icon: BarChart3,
    description: 'Genre group profiles',
  },
  {
    label: 'Model Performance',
    path: '/models',
    icon: Sparkles,
    description: 'Classification results',
  },
]

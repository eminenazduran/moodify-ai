import { useEffect, useState } from 'react'
import { loadDashboardData } from '@/lib/dataLoader'
import type { DashboardData } from '@/types'

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DashboardData }

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    loadDashboardData()
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}

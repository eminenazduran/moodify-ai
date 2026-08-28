import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { GenreInsightsPage } from '@/pages/GenreInsightsPage'
import { HomePage } from '@/pages/HomePage'
import { ModelPerformancePage } from '@/pages/ModelPerformancePage'
import { MoodExplorerPage } from '@/pages/MoodExplorerPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="mood" element={<MoodExplorerPage />} />
          <Route path="recommend" element={<RecommendationsPage />} />
          <Route path="genre" element={<GenreInsightsPage />} />
          <Route path="models" element={<ModelPerformancePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

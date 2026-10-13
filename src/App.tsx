import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from './router'
import LoadingState from './components/ui/LoadingState.tsx'

export default function App() {
  return (
    <Suspense fallback={<LoadingState label="Loading page" />}>
      {useRoutes(routes)}
    </Suspense>
  )
}
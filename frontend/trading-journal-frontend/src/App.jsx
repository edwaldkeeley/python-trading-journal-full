import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Dashboard } from './components/Layout'
import { ErrorBoundary } from './components/UI'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Dashboard } from './components/Layout'
import { ErrorBoundary } from './components/UI'
import { ThemeProvider } from './contexts/ThemeContext'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Dashboard />
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App

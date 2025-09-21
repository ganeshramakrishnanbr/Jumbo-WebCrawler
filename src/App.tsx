import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/common/Layout'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import DashboardPage from './pages/Dashboard'
import CrawlerPage from './pages/Crawler'
import ValidationPage from './pages/Validation'
import ResultsPage from './pages/Results'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/crawler" element={<CrawlerPage />} />
            <Route path="/validation" element={<ValidationPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App

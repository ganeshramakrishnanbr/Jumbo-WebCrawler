import React, { useState, useEffect } from 'react'
import { 
  UrlInput,
  CrawlConfigPanel, 
  CrawlProgress, 
  CrawlControls,
  defaultConfig,
  type CrawlConfig,
  type CrawlProgressType
} from '../components/dashboard'

const CrawlerPage: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('')
  const [config, setConfig] = useState<CrawlConfig>(defaultConfig)
  const [urlHistory, setUrlHistory] = useState<string[]>(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('crawl-url-history')
    return saved ? JSON.parse(saved) : []
  })
  
  const [progress, setProgress] = useState<CrawlProgressType>({
    status: 'idle',
    totalPages: 0,
    crawledPages: 0,
    failedPages: 0,
    queueSize: 0,
    currentUrl: undefined,
    startTime: undefined,
    elapsedTime: 0,
  })

  // Mock WebSocket connection for real-time updates
  useEffect(() => {
    if (progress.status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev.status !== 'running') return prev
          
          const elapsedTime = prev.startTime 
            ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
            : (prev.elapsedTime || 0) + 1
          
          // Simulate progress
          const newCrawledPages = Math.min(prev.crawledPages + Math.random() > 0.7 ? 1 : 0, prev.totalPages)
          const newFailedPages = prev.failedPages + (Math.random() > 0.95 ? 1 : 0)
          const newQueueSize = Math.max(0, prev.queueSize - 1 + (Math.random() > 0.8 ? 2 : 0))
          
          const isCompleted = newCrawledPages >= prev.totalPages || newQueueSize === 0
          
          return {
            ...prev,
            crawledPages: newCrawledPages,
            failedPages: newFailedPages,
            queueSize: newQueueSize,
            elapsedTime,
            status: isCompleted ? 'completed' : 'running',
            currentUrl: isCompleted ? undefined : `${currentUrl}/page-${newCrawledPages + 1}`,
            estimatedTimeRemaining: isCompleted ? 0 : Math.max(0, (prev.totalPages - newCrawledPages) * 2)
          }
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [progress.status, currentUrl])

  // Save URL history to localStorage
  useEffect(() => {
    localStorage.setItem('crawl-url-history', JSON.stringify(urlHistory))
  }, [urlHistory])

  const handleUrlSubmit = (url: string) => {
    if (progress.status !== 'idle') return
    
    // Add to history if not already present
    if (!urlHistory.includes(url)) {
      setUrlHistory(prev => [url, ...prev.slice(0, 9)]) // Keep only last 10
    }
    
    handleStartCrawl(url)
  }

  const handleStartCrawl = (url?: string) => {
    const crawlUrl = url || currentUrl
    if (!crawlUrl) return
    
    console.log('Starting crawl for URL:', crawlUrl, 'with config:', config)
    
    // Initialize progress
    setProgress({
      status: 'running',
      totalPages: config.maxPages,
      crawledPages: 0,
      failedPages: 0,
      queueSize: Math.min(10, config.maxPages), // Start with some items in queue
      currentUrl: crawlUrl,
      startTime: new Date(),
      elapsedTime: 0,
      estimatedTimeRemaining: config.maxPages * 2 // Rough estimate: 2 seconds per page
    })
  }

  const handlePauseCrawl = () => {
    console.log('Pausing crawl')
    setProgress(prev => ({ ...prev, status: 'paused' }))
  }

  const handleResumeCrawl = () => {
    console.log('Resuming crawl')
    setProgress(prev => ({ ...prev, status: 'running' }))
  }

  const handleStopCrawl = () => {
    console.log('Stopping crawl')
    setProgress(prev => ({ ...prev, status: 'idle', currentUrl: undefined }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Web Crawler</h1>
        <p className="text-muted-foreground">
          Crawl websites and extract content with configurable settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <UrlInput
            value={currentUrl}
            onChange={setCurrentUrl}
            onSubmit={handleUrlSubmit}
            disabled={progress.status === 'running'}
            history={urlHistory}
          />
          
          <CrawlConfigPanel
            config={config}
            onChange={setConfig}
            disabled={progress.status === 'running'}
          />
        </div>

        <div className="space-y-6">
          <CrawlProgress progress={progress} />
          
          <CrawlControls
            status={progress.status}
            onStart={() => handleStartCrawl()}
            onPause={handlePauseCrawl}
            onResume={handleResumeCrawl}
            onStop={handleStopCrawl}
            disabled={!currentUrl.trim()}
          />
        </div>
      </div>
    </div>
  )
}

export default CrawlerPage
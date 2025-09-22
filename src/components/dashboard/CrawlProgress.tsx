import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export interface CrawlProgress {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed'
  totalPages: number
  crawledPages: number
  failedPages: number
  queueSize: number
  currentUrl?: string
  startTime?: Date
  elapsedTime?: number
  estimatedTimeRemaining?: number
}

interface CrawlProgressProps {
  progress: CrawlProgress
}

const CrawlProgress: React.FC<CrawlProgressProps> = ({ progress }) => {
  const {
    status,
    totalPages,
    crawledPages,
    failedPages,
    queueSize,
    currentUrl,
    elapsedTime = 0,
    estimatedTimeRemaining,
  } = progress

  // Calculate progress percentage
  const progressPercentage = totalPages > 0 ? (crawledPages / totalPages) * 100 : 0
  const successRate = crawledPages > 0 ? ((crawledPages - failedPages) / crawledPages) * 100 : 0

  // Format time helper
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  // Status color mapping
  const statusColors = {
    idle: 'text-gray-500',
    running: 'text-blue-600',
    paused: 'text-yellow-600',
    completed: 'text-green-600',
    failed: 'text-red-600',
  }

  const statusBgColors = {
    idle: 'bg-gray-500',
    running: 'bg-blue-600',
    paused: 'bg-yellow-600',
    completed: 'bg-green-600',
    failed: 'bg-red-600',
  }

  if (status === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crawl Progress</CardTitle>
          <CardDescription>
            Progress will be displayed once crawling starts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-200 flex items-center justify-center">
              <span className="text-2xl">🕷️</span>
            </div>
            <p>Ready to start crawling</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Crawl Progress</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} bg-opacity-10 ${statusBgColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        {currentUrl && (
          <CardDescription className="truncate">
            Currently crawling: {currentUrl}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <svg
              className="w-24 h-24 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${progressPercentage * 2.83} 283`}
                className={`${statusColors[status]} transition-all duration-500 ease-in-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-lg font-bold ${statusColors[status]}`}>
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">
              {crawledPages - failedPages}
            </div>
            <div className="text-sm text-green-600">
              Successful
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-700">
              {failedPages}
            </div>
            <div className="text-sm text-red-600">
              Failed
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pages Crawled</span>
            <span className="font-medium">{crawledPages} / {totalPages}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Success Rate</span>
            <span className="font-medium">{Math.round(successRate)}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Queue Size</span>
            <span className="font-medium">
              {queueSize}
              {queueSize > 0 && status === 'running' && (
                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              )}
            </span>
          </div>
          
          {elapsedTime > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Elapsed Time</span>
              <span className="font-medium">{formatTime(elapsedTime)}</span>
            </div>
          )}
          
          {estimatedTimeRemaining && estimatedTimeRemaining > 0 && status === 'running' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Est. Remaining</span>
              <span className="font-medium">{formatTime(estimatedTimeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ease-in-out ${statusBgColors[status]}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{totalPages}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CrawlProgress
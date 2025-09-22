import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { PlayIcon, PauseIcon, StopIcon } from '@radix-ui/react-icons'
import * as Dialog from '@radix-ui/react-dialog'
import type { CrawlProgress } from './CrawlProgress'

interface CrawlControlsProps {
  status: CrawlProgress['status']
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  disabled?: boolean
}

const CrawlControls: React.FC<CrawlControlsProps> = ({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false
}) => {
  const [showStopDialog, setShowStopDialog] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Enter':
            event.preventDefault()
            if (status === 'idle') {
              onStart()
            }
            break
          case ' ':
            event.preventDefault()
            if (status === 'running') {
              onPause()
            } else if (status === 'paused') {
              onResume()
            }
            break
          case 'Escape':
            event.preventDefault()
            if (status === 'running' || status === 'paused') {
              setShowStopDialog(true)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [status, onStart, onPause, onResume])

  // Show notification helper
  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleStart = () => {
    onStart()
    showNotification('Crawl started')
  }

  const handlePause = () => {
    onPause()
    showNotification('Crawl paused')
  }

  const handleResume = () => {
    onResume()
    showNotification('Crawl resumed')
  }

  const handleStop = () => {
    onStop()
    setShowStopDialog(false)
    showNotification('Crawl stopped')
  }

  // Button configurations
  const getMainButton = () => {
    switch (status) {
      case 'idle':
      case 'completed':
      case 'failed':
        return (
          <Button
            onClick={handleStart}
            disabled={disabled}
            className="min-w-[120px]"
            size="lg"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Start Crawl
          </Button>
        )
      
      case 'running':
        return (
          <Button
            variant="secondary"
            onClick={handlePause}
            disabled={disabled}
            className="min-w-[120px]"
            size="lg"
          >
            <PauseIcon className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )
      
      case 'paused':
        return (
          <Button
            onClick={handleResume}
            disabled={disabled}
            className="min-w-[120px]"
            size="lg"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Resume
          </Button>
        )
      
      default:
        return null
    }
  }

  const canStop = status === 'running' || status === 'paused'
  const showControls = status !== 'idle'

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Crawl Controls</CardTitle>
          <CardDescription>
            Manage your crawling session
            {(status === 'idle' || status === 'completed' || status === 'failed') && (
              <span className="block text-xs text-muted-foreground mt-1">
                Shortcuts: Ctrl+Enter to start
              </span>
            )}
            {showControls && (
              <span className="block text-xs text-muted-foreground mt-1">
                Shortcuts: Ctrl+Space to pause/resume, Ctrl+Esc to stop
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-3">
            {getMainButton()}
            
            {canStop && (
              <Button
                variant="destructive"
                onClick={() => setShowStopDialog(true)}
                disabled={disabled}
                size="lg"
              >
                <StopIcon className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
          
          {/* Status indicator */}
          {showControls && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'running' ? 'bg-green-500 animate-pulse' :
                  status === 'paused' ? 'bg-yellow-500' :
                  status === 'completed' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  {status === 'running' && 'Crawling in progress...'}
                  {status === 'paused' && 'Crawl is paused'}
                  {status === 'completed' && 'Crawl completed successfully'}
                  {status === 'failed' && 'Crawl failed'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stop Confirmation Dialog */}
      <Dialog.Root open={showStopDialog} onOpenChange={setShowStopDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Stop Crawling?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-6">
              This will stop the current crawl session. Any progress will be saved, but the crawl will not continue.
              Are you sure you want to stop?
            </Dialog.Description>
            
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                variant="destructive"
                onClick={handleStop}
              >
                <StopIcon className="mr-2 h-4 w-4" />
                Stop Crawl
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm">{notification}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default CrawlControls
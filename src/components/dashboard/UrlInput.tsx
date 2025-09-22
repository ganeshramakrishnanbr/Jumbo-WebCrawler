import React, { useState, useRef, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ChevronDownIcon, CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (url: string) => void
  disabled?: boolean
  history?: string[]
}

const UrlInput: React.FC<UrlInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  history = []
}) => {
  const [showHistory, setShowHistory] = useState(false)
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [validationMessage, setValidationMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  // URL validation function
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setValidationState('idle')
      setValidationMessage('')
      return false
    }

    try {
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setValidationState('invalid')
        setValidationMessage('URL must start with http:// or https://')
        return false
      }
      setValidationState('valid')
      setValidationMessage('Valid URL')
      return true
    } catch (error) {
      setValidationState('invalid')
      setValidationMessage('Invalid URL format')
      return false
    }
  }

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Debounce validation
    const timeoutId = setTimeout(() => validateUrl(newValue), 300)
    return () => clearTimeout(timeoutId)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateUrl(value) && !disabled) {
      onSubmit(value)
      setShowHistory(false)
    }
  }

  // Handle history item selection
  const handleHistorySelect = (historyUrl: string) => {
    onChange(historyUrl)
    setShowHistory(false)
    validateUrl(historyUrl)
    inputRef.current?.focus()
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any)
    } else if (e.key === 'ArrowDown' && history.length > 0) {
      setShowHistory(true)
    } else if (e.key === 'Escape') {
      setShowHistory(false)
    }
  }

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false)
      }
    }

    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHistory])

  const isValid = validationState === 'valid'
  const hasError = validationState === 'invalid'
  const canSubmit = isValid && !disabled

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Crawl</CardTitle>
        <CardDescription>
          Enter a website URL to begin crawling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Website URL
            </label>
            <div className="relative">
              <div className="flex">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="url"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com"
                    disabled={disabled}
                    className={`pr-10 ${
                      hasError
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : isValid
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : ''
                    }`}
                  />
                  
                  {/* Validation icon */}
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    {validationState === 'valid' && (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    )}
                    {validationState === 'invalid' && (
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* History dropdown button */}
                {history.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => setShowHistory(!showHistory)}
                    disabled={disabled}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Validation message */}
              {validationMessage && (
                <p className={`text-xs mt-1 ${
                  hasError ? 'text-red-500' : 'text-green-600'
                }`}>
                  {validationMessage}
                </p>
              )}

              {/* History dropdown */}
              {showHistory && history.length > 0 && (
                <div
                  ref={historyRef}
                  className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
                >
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Recent URLs</p>
                    {history.map((historyUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md truncate"
                        onClick={() => handleHistorySelect(historyUrl)}
                      >
                        {historyUrl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="min-w-[120px]"
            >
              {disabled ? 'Crawling...' : 'Start Crawl'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default UrlInput
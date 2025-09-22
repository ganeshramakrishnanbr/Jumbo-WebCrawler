import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ChevronDownIcon, ChevronRightIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import * as Tooltip from '@radix-ui/react-tooltip'

export interface CrawlConfig {
  maxPages: number
  maxDepth: number
  respectRobotsTxt: boolean
  crawlDelay: number
  includeExternalLinks: boolean
  contentTypes: string[]
  userAgent: string
  timeout: number
}

interface CrawlConfigPanelProps {
  config: CrawlConfig
  onChange: (config: CrawlConfig) => void
  disabled?: boolean
}

const defaultConfig: CrawlConfig = {
  maxPages: 50,
  maxDepth: 3,
  respectRobotsTxt: true,
  crawlDelay: 1000,
  includeExternalLinks: false,
  contentTypes: ['text/html'],
  userAgent: 'JumboWebCrawler/1.0',
  timeout: 10000,
}

const CrawlConfigPanel: React.FC<CrawlConfigPanelProps> = ({
  config,
  onChange,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateConfig = (updates: Partial<CrawlConfig>) => {
    onChange({ ...config, ...updates })
  }

  const resetToDefaults = () => {
    onChange(defaultConfig)
  }

  const TooltipWrapper: React.FC<{ content: string; children: React.ReactNode }> = ({
    content,
    children
  }) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-xs rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
            sideOffset={4}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Crawl Configuration</CardTitle>
            <CardDescription>
              Customize your crawling parameters
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
            className="h-8 px-2"
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Max Pages</label>
                <TooltipWrapper content="Maximum number of pages to crawl (1-1000)">
                  <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <Input
                type="number"
                min="1"
                max="1000"
                value={config.maxPages}
                onChange={(e) => updateConfig({ maxPages: parseInt(e.target.value) || 1 })}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Max Depth</label>
                <TooltipWrapper content="Maximum crawling depth from the starting URL (1-10)">
                  <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <Input
                type="number"
                min="1"
                max="10"
                value={config.maxDepth}
                onChange={(e) => updateConfig({ maxDepth: parseInt(e.target.value) || 1 })}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Timing Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Crawl Delay (ms)</label>
                <TooltipWrapper content="Delay between requests in milliseconds (500-5000)">
                  <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <Input
                type="number"
                min="500"
                max="5000"
                step="100"
                value={config.crawlDelay}
                onChange={(e) => updateConfig({ crawlDelay: parseInt(e.target.value) || 1000 })}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Timeout (ms)</label>
                <TooltipWrapper content="Request timeout in milliseconds (5000-30000)">
                  <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <Input
                type="number"
                min="5000"
                max="30000"
                step="1000"
                value={config.timeout}
                onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || 10000 })}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Boolean Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Respect robots.txt</label>
                <TooltipWrapper content="Honor robots.txt directives from websites">
                  <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <button
                type="button"
                onClick={() => updateConfig({ respectRobotsTxt: !config.respectRobotsTxt })}
                disabled={disabled}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  config.respectRobotsTxt
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.respectRobotsTxt ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Include External Links</label>
                <TooltipWrapper content="Crawl links that point to other domains">
                  <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <button
                type="button"
                onClick={() => updateConfig({ includeExternalLinks: !config.includeExternalLinks })}
                disabled={disabled}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  config.includeExternalLinks
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.includeExternalLinks ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* User Agent Setting */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">User Agent</label>
              <TooltipWrapper content="User agent string sent with requests">
                <QuestionMarkCircledIcon className="h-3 w-3 text-muted-foreground" />
              </TooltipWrapper>
            </div>
            <Input
              type="text"
              value={config.userAgent}
              onChange={(e) => updateConfig({ userAgent: e.target.value })}
              disabled={disabled}
              placeholder="JumboWebCrawler/1.0"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              disabled={disabled}
            >
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default CrawlConfigPanel
export { defaultConfig }
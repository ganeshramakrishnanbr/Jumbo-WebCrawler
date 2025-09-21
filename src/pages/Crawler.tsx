import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

const CrawlerPage: React.FC = () => {
  const [urls, setUrls] = React.useState('')
  
  const handleStartCrawl = () => {
    console.log('Starting crawl for URLs:', urls.split('\n').filter(Boolean))
    // TODO: Implement actual crawl logic
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Web Crawler</h1>
        <p className="text-muted-foreground">
          Start a new web crawling job by providing URLs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start New Crawl</CardTitle>
          <CardDescription>
            Enter URLs (one per line) to start crawling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              URLs to Crawl
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="https://example.com&#10;https://another-site.com&#10;..."
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleStartCrawl} disabled={!urls.trim()}>
              Start Crawling
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CrawlerPage
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const ResultsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Results</h1>
        <p className="text-muted-foreground">
          View and export your crawling results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crawl Results</CardTitle>
          <CardDescription>
            Coming soon - View and manage your crawling results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will be implemented to display crawl results and provide export options.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultsPage
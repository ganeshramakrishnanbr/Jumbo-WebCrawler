import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const ValidationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">URL Validation</h1>
        <p className="text-muted-foreground">
          Validate URLs before crawling to ensure they're accessible
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bulk URL Validation</CardTitle>
          <CardDescription>
            Coming soon - Validate multiple URLs at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will be implemented to validate URLs before crawling.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ValidationPage
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

export const defaultConfig: CrawlConfig = {
  maxPages: 50,
  maxDepth: 3,
  respectRobotsTxt: true,
  crawlDelay: 1000,
  includeExternalLinks: false,
  contentTypes: ['text/html'],
  userAgent: 'JumboWebCrawler/1.0',
  timeout: 10000,
}
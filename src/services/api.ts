import type { ApiResponse, CrawlJob, UrlValidationResult, ExportOptions } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      }

      const response = await fetch(url, config)
      
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Crawler API methods
  async startCrawl(urls: string[]): Promise<ApiResponse<CrawlJob>> {
    return this.request<CrawlJob>('/crawl', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    })
  }

  async getCrawlJob(id: string): Promise<ApiResponse<CrawlJob>> {
    return this.request<CrawlJob>(`/crawl/${id}`)
  }

  async getCrawlJobs(): Promise<ApiResponse<CrawlJob[]>> {
    return this.request<CrawlJob[]>('/crawl')
  }

  async stopCrawl(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/crawl/${id}/stop`, {
      method: 'POST',
    })
  }

  // URL Validation API methods
  async validateUrls(urls: string[]): Promise<ApiResponse<UrlValidationResult[]>> {
    return this.request<UrlValidationResult[]>('/validate', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    })
  }

  // Export API methods
  async exportResults(options: ExportOptions): Promise<ApiResponse<Blob>> {
    const response = await fetch(`${this.baseUrl}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const blob = await response.blob()
    return {
      success: true,
      data: blob,
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health')
  }
}

export const apiClient = new ApiClient()
export default apiClient
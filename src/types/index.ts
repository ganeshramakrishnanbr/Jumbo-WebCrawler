// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Crawl Job types
export interface CrawlJob {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  resultsCount?: number;
}

// URL Validation types
export interface UrlValidationResult {
  url: string;
  isValid: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
}

// Export types
export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx' | 'markdown';
  jobId: string;
  filename?: string;
}

// Common UI types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
}
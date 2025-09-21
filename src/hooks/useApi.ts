import { useState, useCallback } from 'react'
import { apiClient } from '../services/api'
import type { ApiResponse } from '../types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

type ApiFunction<T, TArgs extends unknown[] = unknown[]> = (...args: TArgs) => Promise<ApiResponse<T>>

interface UseApiReturn<T, TArgs extends unknown[] = unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<ApiResponse<T>>
  reset: () => void
}

export function useApi<T, TArgs extends unknown[] = unknown[]>(
  apiFunction: ApiFunction<T, TArgs>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: TArgs): Promise<ApiResponse<T>> => {
      setState({ data: null, loading: true, error: null })

      try {
        const response = await apiFunction(...args)

        if (response.success) {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
          })
        } else {
          setState({
            data: null,
            loading: false,
            error: response.error || 'An error occurred',
          })
        }

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        })

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Specific hooks for common API calls
export const useCrawlJobs = () => useApi(apiClient.getCrawlJobs)
export const useStartCrawl = () => useApi(apiClient.startCrawl)
export const useValidateUrls = () => useApi(apiClient.validateUrls)
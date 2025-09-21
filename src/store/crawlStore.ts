import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { CrawlJob } from '../types'

interface CrawlStore {
  jobs: CrawlJob[]
  currentJob: CrawlJob | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setJobs: (jobs: CrawlJob[]) => void
  addJob: (job: CrawlJob) => void
  updateJob: (id: string, updates: Partial<CrawlJob>) => void
  setCurrentJob: (job: CrawlJob | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useCrawlStore = create<CrawlStore>()(
  devtools(
    persist(
      immer((set) => ({
        jobs: [],
        currentJob: null,
        isLoading: false,
        error: null,

        setJobs: (jobs) =>
          set((state) => {
            state.jobs = jobs
          }),

        addJob: (job) =>
          set((state) => {
            state.jobs.push(job)
          }),

        updateJob: (id, updates) =>
          set((state) => {
            const index = state.jobs.findIndex((job) => job.id === id)
            if (index !== -1) {
              Object.assign(state.jobs[index], updates)
            }
          }),

        setCurrentJob: (job) =>
          set((state) => {
            state.currentJob = job
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setError: (error) =>
          set((state) => {
            state.error = error
          }),

        clearError: () =>
          set((state) => {
            state.error = null
          }),
      })),
      {
        name: 'crawl-store',
        partialize: (state) => ({
          jobs: state.jobs,
          currentJob: state.currentJob,
        }),
      }
    ),
    { name: 'crawl-store' }
  )
)
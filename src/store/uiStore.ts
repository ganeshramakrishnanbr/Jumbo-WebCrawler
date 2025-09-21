import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UIStore {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  activeTab: string
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIStore>()(
  devtools(
    immer((set) => ({
      theme: 'system',
      sidebarOpen: true,
      activeTab: 'dashboard',

      setTheme: (theme) =>
        set((state) => {
          state.theme = theme
        }),

      toggleSidebar: () =>
        set((state) => {
          state.sidebarOpen = !state.sidebarOpen
        }),

      setSidebarOpen: (open) =>
        set((state) => {
          state.sidebarOpen = open
        }),

      setActiveTab: (tab) =>
        set((state) => {
          state.activeTab = tab
        }),
    })),
    { name: 'ui-store' }
  )
)
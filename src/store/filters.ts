import { create } from 'zustand'

interface FiltersState {
  statusFilter: string   // '' | 'SCHEDULED' | 'IN_PLAY' | 'FINISHED'
  groupFilter: string    // '' | 'GROUP_A' … 'GROUP_L'
  setStatusFilter: (v: string) => void
  setGroupFilter: (v: string) => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersState>(set => ({
  statusFilter: '',
  groupFilter: '',
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setGroupFilter: (groupFilter) => set({ groupFilter }),
  resetFilters: () => set({ statusFilter: '', groupFilter: '' }),
}))

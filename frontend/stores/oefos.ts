import { defineStore } from 'pinia'

export interface OefosEntry {
  Ebene: string
  'EDV-Code': string
  Code: string
  Titel: string
  Kurztitel: string
}

export interface OefosNode extends OefosEntry {
  children: OefosNode[]
}

export const useOefosStore = defineStore('oefos', {
  state: () => ({
    entries: {
      de: [] as OefosEntry[],
      en: [] as OefosEntry[]
    },
    selectedCodes: [] as string[],
    loading: false,
    loaded: false
  }),

  getters: {
    getTree: (state) => (lang: 'de' | 'en' = 'de') => {
      const flatEntries = state.entries[lang]
      if (!flatEntries.length) return []

      const rootNodes: OefosNode[] = []
      const map = new Map<string, OefosNode>()

      // First pass: create all nodes and map them by Code
      flatEntries.forEach(entry => {
        if (!entry.Code) return
        const node = { ...entry, children: [] }
        map.set(entry.Code, node)
      })

      // Second pass: connect children to parents
      flatEntries.forEach(entry => {
        if (!entry.Code) return
        const node = map.get(entry.Code)!
        const level = parseInt(entry.Ebene)

        if (level === 1) {
          rootNodes.push(node)
        } else {
          // Find parent code
          // Code logic: 101 -> 1, 1010 -> 101, 101001 -> 1010
          let parentCode = ''
          if (entry.Code.length === 3) parentCode = entry.Code.substring(0, 1)
          else if (entry.Code.length === 4) parentCode = entry.Code.substring(0, 3)
          else if (entry.Code.length === 6) parentCode = entry.Code.substring(0, 4)

          if (parentCode && map.has(parentCode)) {
            map.get(parentCode)!.children.push(node)
          } else {
            // Fallback for codes that don't follow the pattern or if parent is missing
            // In OEFOS, sometimes the EBENE is the only guide.
            // But usually the code prefix is the standard.
            // If parent is not found via code prefix, we might need a more complex lookup.
            // For now, let's stick to prefix.
          }
        }
      })

      return rootNodes
    }
  },

  actions: {
    toggleSelection(code: string) {
      const index = this.selectedCodes.indexOf(code)
      if (index > -1) {
        this.selectedCodes.splice(index, 1)
      } else {
        this.selectedCodes.push(code)
      }
    },
    isSelected(code: string) {
      return this.selectedCodes.includes(code)
    },
    async fetchAll() {
      if (this.loaded) return
      this.loading = true
      try {
        const data = await $fetch<{ de: OefosEntry[], en: OefosEntry[] }>('/api/oefos')
        this.entries.de = data.de
        this.entries.en = data.en
        this.loaded = true
      } catch (error) {
        console.error('Failed to fetch OEFOS:', error)
      } finally {
        this.loading = false
      }
    }
  }
})

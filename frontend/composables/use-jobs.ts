import { ref, onMounted, onUnmounted } from 'vue'
import { useApiUtils } from './use-api-utils'

export interface Job {
  id: string
  type: string
  targetId: string
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  progress: number
  total?: number
  message?: string
  result?: any
  createdAt: string
  updatedAt: string
}

export const useJobs = () => {
  const jobs = ref<Job[]>([])
  let intervalId: ReturnType<typeof setInterval> | null = null
  const { apiCall } = useApiUtils()

  const fetchJobs = async () => {
    try {
      const response = await apiCall('job')
      if (response) {
        jobs.value = response
      }
    } catch (e) {
      console.error('Failed to fetch jobs', e)
    }
  }

  const cancelJob = async (jobId: string) => {
    try {
      await apiCall(`job/${jobId}/cancel`, 'POST')
      await fetchJobs() // Refresh the list immediately
    } catch (e) {
      console.error('Failed to cancel job', e)
    }
  }

  const startPolling = (intervalMs = 3000) => {
    if (intervalId) return
    fetchJobs()
    intervalId = setInterval(fetchJobs, intervalMs)
  }

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const getJobById = (id: string) => {
    return jobs.value.find(job => job.id === id)
  }

  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
  })

  return {
    jobs,
    getJobById,
    fetchJobs,
    cancelJob
  }
}

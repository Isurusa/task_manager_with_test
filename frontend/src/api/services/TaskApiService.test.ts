import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskApiService } from './TaskApiService'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('TaskApiService', () => {
  let apiService: TaskApiService
  const baseUrl = 'http://127.0.0.1:8000/api'

  beforeEach(() => {
    vi.clearAllMocks()
    apiService = new TaskApiService(baseUrl)
  })

  describe('getTasks', () => {
    it('fetches tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', is_completed: false },
        { id: 2, title: 'Task 2', is_completed: false }
      ]

      mockedAxios.get.mockResolvedValue({ data: mockTasks })

      const tasks = await apiService.getTasks()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/tasks`)
      expect(tasks).toEqual(mockTasks)
    })

    it('handles fetch errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'))

      await expect(apiService.getTasks()).rejects.toThrow('Network error')
    })
  })

  describe('createTask', () => {
    it('creates task successfully', async () => {
      const taskData = { title: 'New Task', description: 'Description' }
      const mockResponse = { id: 1, ...taskData, is_completed: false }

      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      const task = await apiService.createTask(taskData)

      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseUrl}/tasks`, taskData)
      expect(task).toEqual(mockResponse)
    })
  })

  describe('completeTask', () => {
    it('completes task successfully', async () => {
      const taskId = 1
      const mockResponse = { success: true, message: 'Task completed' }

      mockedAxios.put.mockResolvedValue({ data: mockResponse })

      const response = await apiService.completeTask(taskId)

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${baseUrl}/tasks/${taskId}/complete`
      )
      expect(response).toEqual(mockResponse)
    })
  })
})
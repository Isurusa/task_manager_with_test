import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

afterEach(() => {
  cleanup()
  server.resetHandlers()
})


afterAll(() => server.close())
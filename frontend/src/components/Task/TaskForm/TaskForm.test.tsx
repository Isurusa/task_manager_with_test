import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from './TaskForm'

// Mock the hook directly
const mockUseTasks = vi.fn()

vi.mock('../../../hooks/useTasks', () => ({
    useTasks: () => mockUseTasks(),
}))

describe('TaskForm', () => {
    const mockAddTask = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        // Setup default mock implementation
        mockUseTasks.mockReturnValue({
            addTask: mockAddTask,
            loading: { create: false, tasks: false, complete: false },
            error: null,
            loadTasks: vi.fn(),
            completeTask: vi.fn(),
            tasks: [],
        })

        // Reset window.alert
        window.alert = vi.fn()
    })

    it('renders form fields', () => {
        render(<TaskForm />)

        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })

    it('prevents submission when title is empty', async () => {
        const user = userEvent.setup()

        render(<TaskForm />)

        const submitButton = screen.getByRole('button', { name: /add/i })

        // Try to submit without title
        await user.click(submitButton)

        // Core validation: form shouldn't submit
        expect(mockAddTask).not.toHaveBeenCalled()

        // Optional: check that we can still type and submit after
        await user.type(screen.getByPlaceholderText('Title'), 'Test Task')
        await user.click(submitButton)

        expect(mockAddTask).toHaveBeenCalledWith({
            title: 'Test Task',
            description: ''
        })
    })

    it('submits form with data', async () => {
        const user = userEvent.setup()
        mockAddTask.mockResolvedValue({})

        render(<TaskForm />)

        await user.type(screen.getByPlaceholderText('Title'), 'Test Task')
        await user.click(screen.getByRole('button', { name: /add/i }))

        expect(mockAddTask).toHaveBeenCalledWith({
            title: 'Test Task',
            description: ''
        })
    })

    it('shows loading state', () => {
        mockUseTasks.mockReturnValue({
            addTask: mockAddTask,
            loading: { create: true, tasks: false, complete: false },
            error: null,
            loadTasks: vi.fn(),
            completeTask: vi.fn(),
            tasks: [],
        })

        render(<TaskForm />)

        // Instead of checking for button with spinner, check for TaskFormSkeleton
        // The skeleton component should be rendered
        expect(screen.getByTestId('task-form-skeleton')).toBeInTheDocument()

        // The form should not be visible
        expect(screen.queryByRole('form')).not.toBeInTheDocument()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('shows error', () => {
        mockUseTasks.mockReturnValue({
            addTask: mockAddTask,
            loading: { create: false, tasks: false, complete: false },
            error: 'Test error',
            loadTasks: vi.fn(),
            completeTask: vi.fn(),
            tasks: [],
        })

        render(<TaskForm />)

        expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('clears form after submission', async () => {
        const user = userEvent.setup()
        mockAddTask.mockResolvedValue({})

        render(<TaskForm />)

        const titleInput = screen.getByPlaceholderText('Title')
        const descriptionInput = screen.getByPlaceholderText('Description')

        await user.type(titleInput, 'Test Task')
        await user.type(descriptionInput, 'Test Description')
        await user.click(screen.getByRole('button', { name: /add/i }))

        await waitFor(() => {
            expect(titleInput).toHaveValue('')
            expect(descriptionInput).toHaveValue('')
        })
    })
})
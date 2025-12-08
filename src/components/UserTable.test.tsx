import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import UserTable from './UserTable'

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe('UserTable', () => {
  test('renders button and does not show table initially', () => {
    render(<UserTable />)
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument()
    expect(screen.queryByText(/иван/i)).not.toBeInTheDocument()
  })

  test('loads users and displays them when button is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
    ]

    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    })

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    expect(await screen.findByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument()
  })

  test('shows error when fetch fails', async () => {
    ;(globalThis.fetch as any).mockRejectedValue(new Error('Network error'))

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    expect(await screen.findByText(/ошибка при загрузке/i)).toBeInTheDocument()
  })
})

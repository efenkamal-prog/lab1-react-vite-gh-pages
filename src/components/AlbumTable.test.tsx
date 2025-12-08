import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AlbumTable from './AlbumTable'

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

test('renders button initially', () => {
  render(<AlbumTable />)
  expect(screen.getByText(/загрузить альбомы/i)).toBeInTheDocument()
})

test('loads albums with photo counts', async () => {
  const mockAlbums = [
    { userId: 1, id: 1, title: 'Альбом 1' },
    { userId: 1, id: 2, title: 'Альбом 2' }
  ]

  const mockPhotos1 = [{ id: 1 }, { id: 2 }]
  const mockPhotos2 = [{ id: 3 }]

  ;(globalThis.fetch as any)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockAlbums
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos1
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos2
    })

  render(<AlbumTable />)
  fireEvent.click(screen.getByText(/загрузить альбомы/i))

  expect(await screen.findByText('Альбом 1')).toBeInTheDocument()

  const row1 = screen.getByText('Альбом 1').closest('tr')
  expect(row1).toHaveTextContent('2')

  const row2 = screen.getByText('Альбом 2').closest('tr')
  expect(row2).toHaveTextContent('1')
})

test('shows error on failure', async () => {
  ;(globalThis.fetch as any).mockRejectedValue(new Error('Network error'))

  render(<AlbumTable />)
  fireEvent.click(screen.getByText(/загрузить альбомы/i))

  expect(await screen.findByText(/ошибка при загрузке/i)).toBeInTheDocument()
})

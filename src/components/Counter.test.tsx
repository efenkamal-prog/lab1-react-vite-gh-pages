import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test } from 'vitest'
import Counter from './Counter'

test('renders counter button with initial value 0', () => {
  render(<Counter />)
  const button = screen.getByText(/count is 0/i)
  expect(button).toBeInTheDocument()
})

test('increments counter when button is clicked', () => {
  render(<Counter />)
  const button = screen.getByText(/count is 0/i)
  fireEvent.click(button)
  expect(screen.getByText(/count is 1/i)).toBeInTheDocument()
})
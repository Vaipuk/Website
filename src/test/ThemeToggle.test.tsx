import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../components/ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.dataset.theme = 'dark'
})

test('renders a toggle button', () => {
  render(<ThemeToggle />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
})

test('defaults to dark theme', () => {
  render(<ThemeToggle />)
  expect(document.documentElement.dataset.theme).toBe('dark')
})

test('clicking toggles from dark to light', () => {
  render(<ThemeToggle />)
  fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem('theme')).toBe('light')
})

test('clicking twice returns to dark', () => {
  render(<ThemeToggle />)
  const btn = screen.getByRole('button', { name: /toggle theme/i })
  fireEvent.click(btn)
  fireEvent.click(btn)
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem('theme')).toBe('dark')
})

test('reads saved light theme from localStorage on mount', () => {
  localStorage.setItem('theme', 'light')
  render(<ThemeToggle />)
  expect(document.documentElement.dataset.theme).toBe('light')
})

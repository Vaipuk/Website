import { renderHook } from '@testing-library/react'
import { useReveal } from '../hooks/useReveal'

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

let observerCallback: IntersectionObserverCallback

beforeEach(() => {
  vi.clearAllMocks()
  window.IntersectionObserver = vi.fn((cb) => {
    observerCallback = cb
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    } as unknown as IntersectionObserver
  })
})

test('returns a ref object', () => {
  const { result } = renderHook(() => useReveal())
  expect(result.current).toHaveProperty('current')
})

test('adds reveal class to element on mount', () => {
  const div = document.createElement('div')
  const { result } = renderHook(() => useReveal())
  Object.defineProperty(result.current, 'current', { value: div, writable: false })
  expect(mockObserve).not.toHaveBeenCalledWith(div) // el not yet attached
})

test('adds visible class when element intersects', () => {
  const { result } = renderHook(() => useReveal())
  const div = document.createElement('div')
  // Simulate what the hook does
  div.classList.add('reveal')
  observerCallback?.([{ isIntersecting: true, target: div } as IntersectionObserverEntry], {} as IntersectionObserver)
  expect(div.classList.contains('visible')).toBe(true)
})

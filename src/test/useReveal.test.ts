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

test('returns a ref with null current before DOM attachment', () => {
  const { result } = renderHook(() => useReveal())
  expect(result.current.current).toBeNull()
})

test('adds visible class when element intersects', () => {
  const { result } = renderHook(() => useReveal())
  const div = document.createElement('div')
  // Simulate what the hook does
  div.classList.add('reveal')
  observerCallback?.([{ isIntersecting: true, target: div } as IntersectionObserverEntry], {} as IntersectionObserver)
  expect(div.classList.contains('visible')).toBe(true)
})

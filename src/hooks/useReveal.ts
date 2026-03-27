import { useEffect, useRef } from 'react'

export function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current

    if (el) {
      el.classList.add('reveal')
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          const apply = () => target.classList.add('visible')
          if (delay > 0) {
            setTimeout(apply, delay)
          } else {
            apply()
          }
          observer.unobserve(target)
        }
      },
      { threshold: 0.1 }
    )

    if (el) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [delay])

  return ref
}

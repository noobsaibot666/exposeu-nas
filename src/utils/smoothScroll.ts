const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function smoothScrollTo(selector: string, duration = 500, offset = 0) {
  const target = document.querySelector(selector)
  if (!target) return

  const targetY = target.getBoundingClientRect().top + window.scrollY - offset

  if (prefersReducedMotion()) {
    window.scrollTo({ top: targetY, behavior: 'instant' })
    return
  }

  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo({ top: startY + distance * easeOutCubic(progress), behavior: 'instant' })
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

export function smoothScrollTo(selector: string, duration = 500, offset = 0) {
  const target = document.querySelector(selector)
  if (!target) return

  const targetY = target.getBoundingClientRect().top + window.scrollY - offset
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

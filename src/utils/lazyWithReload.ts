import { lazy, type ComponentType } from 'react'

const RELOAD_FLAG = 'chunk_reload_attempted'

/**
 * React.lazy() for route components, with recovery from stale deploys: a tab
 * opened before a frontend deploy still references the previous build's
 * hashed chunk names, which no longer exist on the server. When a chunk fails
 * to load, reload the page once to pick up the new index.html. The flag stops
 * a reload loop if the failure is something else (e.g. offline).
 */
export function lazyWithReload<T extends ComponentType<object>>(
  load: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const module = await load()
      try { sessionStorage.removeItem(RELOAD_FLAG) } catch { /* storage unavailable */ }
      return module
    } catch (error) {
      let alreadyReloaded = true
      try {
        alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1'
        if (!alreadyReloaded) sessionStorage.setItem(RELOAD_FLAG, '1')
      } catch { /* storage unavailable: don't risk a loop */ }
      if (!alreadyReloaded) {
        window.location.reload()
        // Keep Suspense showing its fallback until the reload happens.
        return new Promise<{ default: T }>(() => {})
      }
      throw error
    }
  })
}

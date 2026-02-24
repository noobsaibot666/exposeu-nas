# Quality Checklist

Reference for contributors. Prevents regressions introduced in Phase 1–3.

## CSS Rules

- **No hex colors in page CSS** — all colors must reference `:root` tokens from `index.css`
- **No `outline: none`** — use `:focus-visible` with a visible outline instead
- **No blanket `will-change`** — only apply to elements with continuous/perpetual animation (e.g. `gsap.quickTo`). GSAP scroll-reveal elements do not need it
- **Transition tiers** — use `--transition-fast` (150ms), `--transition-medium` (200ms), or `--transition-slow` (300ms). No custom durations
- **Error colors** — use `var(--error-color)`, not `#f87171`
- **Success colors** — use `var(--positive-accent)`, not `#4ade80`

## HTML / JSX Rules

- **`aria-hidden`** — always use `aria-hidden="true"`, never the boolean shorthand `aria-hidden`
- **`id="main"`** — every page-level `<main>` must have `id="main"` for the skip-link in `App.tsx`
- **Images below the fold** — must have `loading="lazy"` and `decoding="async"`
- **Images above the fold (LCP candidates)** — must NOT have `loading="lazy"`
- **Internal links** — use `<Link to="...">` from react-router-dom, not `<a href="...">`

## Accessibility

- **Modals/dialogs** — must have `role="dialog"`, `aria-modal="true"`, Escape to close, focus trap, and focus restore on close
- **Drawers/menus** — must restore focus to the toggle button on close
- **Form errors** — use `role="alert" aria-live="assertive"` on error containers
- **Reduced motion** — all GSAP effects must check `prefers-reduced-motion: reduce` before running; CSS animations must have a `@media (prefers-reduced-motion: reduce)` override

## Performance

- **CLS prevention** — images should have `aspect-ratio` or explicit dimensions
- **`will-change` audit** — if adding `will-change`, document why in a comment

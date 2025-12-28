---
trigger: always_on
---

---
description: How to optimize INP (Interaction to Next Paint) in React
---
## INP Optimization Rules
1. **Never block the main thread** in click/scroll handlers
   - Wrap expensive operations in `requestAnimationFrame` or `setTimeout(..., 0)`
2. **Use passive event listeners** for scroll/touch:
   ```javascript
   element.addEventListener('scroll', handler, { passive: true })
Debounce rapid-fire events (resize, scroll, input):

const debouncedHandler = useMemo(() => debounce(handler, 100), [])
Use CSS will-change for animated elements:

.animated-element {
  will-change: transform, opacity;
}
Avoid layout thrashing - batch DOM reads before writes

Use React.memo for expensive components

Defer non-critical animations until after paint:

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    // Animation starts here
  })
})
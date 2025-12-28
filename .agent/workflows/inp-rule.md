---
description: How to optimize INP (Interaction to Next Paint) in React
---

## INP Optimization Rules

1. **Never block the main thread** in click/scroll handlers
   - Wrap expensive operations in `requestAnimationFrame` or `setTimeout(..., 0)`
   - Avoid complex logic inside event handlers that run frequently.

2. **Use passive event listeners** for scroll/touch:
   ```javascript
   element.addEventListener('scroll', handler, { passive: true })
   ```
   - In React, if attaching manually to DOM elements (like in `useEffect`), always use `{ passive: true }`.

3. **Debounce rapid-fire events** (resize, scroll, input):
   ```javascript
   // Example using lodash or custom debounce
   const debouncedHandler = useMemo(() => debounce(handler, 100), [])
   ```

4. **Use CSS `will-change`** for animated elements:
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```
   - Use sparingly, only on elements currently being animated.

5. **Avoid layout thrashing**
   - Batch DOM reads before writes.
   - Don't read layout properties (like `offsetHeight`) immediately after writing styles in the same frame.

6. **Use `React.memo`** for expensive components
   - Prevent unnecessary re-renders of heavy child components when parent state changes.

7. **Defer non-critical animations** until after paint:
   ```javascript
   requestAnimationFrame(() => {
     requestAnimationFrame(() => {
       // Animation starts here
     })
   })
   ```

8. **Transition/StartTransition**
   - Use `useTransition` for non-urgent state updates that might block the UI.

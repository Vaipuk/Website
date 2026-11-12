# Canvas particle morphing for VB

## How should the two text masks share particle identities and interpolate smoothly

### Takeaway
Keep the same finite particle array from the VB formation through the full-name formation. Precompute a second pair of target coordinates for each particle, then interpolate its position along an eased, bounded path; do not discard the initials field and introduce an unrelated title animation.

### Cited Findings
- Ksenia Kondrashova's creator tutorial draws multiline text into a transparent Canvas, reads pixel data, and turns occupied samples into coordinates. Its sampling stage is separate from Three.js rendering, so this coordinate-generation technique does not inherently require WebGL. Its later typing section retains particle properties and matching coordinates instead of resetting every particle when text changes. The article also describes matching the Canvas and DOM typography for consistent positioning. The primary article was available in the search tool's full indexed content; direct open returned 403, so no live-demo smoothness or current browser rendering was verified. — [Codrops creator tutorial](https://tympanus.net/codrops/2022/11/08/3d-typing-effects-with-three-js/)
- requestAnimationFrame is a one-shot scheduling API; ongoing animation schedules the next frame explicitly. The callback timestamp should drive progression so that display refresh rate does not alter animation speed, and callbacks are commonly paused in background tabs. — [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

### Inferences
- For this specific, fixed transition, keep the existing 1,100 desktop / 600 phone particles. Give every particle both `markX/markY` and `nameX/nameY`; resample each mask to that same count once. Reuse current seeded noise for static variation. No per-frame random target selection, resampling, or particle recreation is needed.
- A deterministic row-major sample-to-sample correspondence is the smallest usable implementation. For a more coherent result, assign the left portion of VB to the first-name mask and the right portion to the surname mask, then preserve the order within each group. A full global nearest-neighbor assignment is unnecessary for two predetermined shapes and can produce needless preprocessing cost.
- Use a clamped smoothstep interpolation `p*p*(3-2*p)` between the initial and final targets. Add a small perpendicular arc multiplied by `sin(pi*p)` only while the shape transforms, so every point still finishes exactly at its text target. These are design/algorithm recommendations, not claims that the reference uses this exact formula.
- Suggested choreography within the existing 3,600ms deadline: gather VB by about 800ms, hold briefly until 1,050ms, reshape it into two lines through roughly 1,900ms, settle into clear typography by 2,150ms, hold until about 2,750ms, then let the accepted photographic camera transition reveal the page. The old separate diagonal title entrances should be removed. These timings are original recommendations, not measured reference timings.
- Use fixed elapsed-time stages rather than an endless spring simulation: exact finite endpoints are easier to synchronize with CSS and to test. Preserve the existing null-context fallback, cleanup, resize listener removal, and last-frame stop.

### Gaps
- The source tutorial demonstrates changing sampled text and preserving particles, not this exact initials-to-two-line-name correspondence. The proposed index mapping and arc must be judged in the local preview.
- No density or frame-rate claim is supported for the user's hardware. A large name made from 1,100 points may look too sparse by itself; a crisp settled text layer should finish the effect rather than increasing the count without evidence.

## How should Canvas targets align with the final title without waiting for fonts

### Takeaway
The particle target and settled title must share a coordinate system and typography. Choose the font once for this short opening, keep the 3,600ms deadline independent of font loading, and prevent late font completion from replaying or moving the scene.

### Cited Findings
- TextMetrics describes dimensions in CSS pixels for the current Canvas font. Its actual left/right bounds can exceed advance width for italic/slanted text; actual ascent and descent describe the visible glyph bounds relative to the baseline. — [MDN TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics)
- FontFaceSet.load accepts a CSS-style font specification and returns a promise for loaded FontFace objects; a load failure rejects the promise. An optional text string restricts matching Unicode ranges but is not a glyph-coverage test. — [MDN FontFaceSet.load](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load)
- FontFaceSet.check answers whether rendering with a specification would cause a font load/swap. It can return true even when a requested font does not exist; it is not an exact font-availability test. — [MDN FontFaceSet.check](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check)

### Inferences
- Existing source inspection found that the particle Canvas covers the viewport, while `.typography` is inside `.world`, which rotates and changes Z throughout the intro. Targets computed from viewport dimensions cannot match text that is independently projected in that world. Put particles and the settled title in the same untransformed overlay during the morph, or render both the particle targets and crisp final text on one Canvas. The photo world can continue independently around it.
- The smallest robust option is to render the settled name in the same Canvas using the same cached font, positions, and measured baselines used to sample its mask. Fade the points into that stationary text over roughly 180–250ms. This removes a Canvas-to-DOM font/spacing/projection mismatch and keeps the full-name reveal visibly caused by the particles. Retain the existing dialog accessible name; this decorative Canvas does not need to become keyboard or screen-reader content.
- If keeping DOM text, copy its computed font/style/weight/size/letter spacing before constructing targets, or derive both layers from one explicit layout. Remember italic surname overhang when fitting at 320px. Do not sample a small arbitrary mask and stretch it to a different letter-spaced DOM line.
- Prefer a bounded font preparation period inside the VB gather phase. Request the exact normal and italic faces with `document.fonts.load`, accepting successful nonempty results only before a short cutoff (for example 500ms). Otherwise lock a system serif fallback for this entire intro. This is a recommended policy; no source mandates the cutoff. Never wait indefinitely or extend the lifecycle timer.
- Ignore a font promise after cleanup or after targets have been frozen; catch rejection. Resample on resize only while alive and keep the elapsed origin, so resizing does not restart the opening. The same rule prevents StrictMode's disposed first pass from doing late work.
- Tests should assert continuity at both morph boundaries, exact final target coordinates, finite values for negative/late times, no new frames after stop/unmount, no asynchronous mutation after disposal, and deadline completion even if font loading stalls or rejects. Preview the real 320px surname fit and the settled title before making legibility claims.

### Gaps
- Browser rasterization varies; the exact perceived smoothness of a Canvas-to-DOM crossfade cannot be established by TextMetrics documentation alone. The same-Canvas settled title avoids most of that alignment surface.
- This research did not change implementation, run tests, inspect the final browser sequence, or benchmark a physical phone. It provides a focused mechanism and verification criteria for the implementer.

# Readability and lifecycle for the name morph

## How can the particles become crisp serif lettering on phones and with missing fonts or Canvas

### Takeaway
Make the particle destination and the crisp name share one stable geometry and font choice, then crossfade in place after the particles settle. Keep a readable DOM name as the independent fallback, and fit both lines using the actual ink bounds rather than assuming the italic surname fits its advance width.

### Cited Findings
- Canvas text metrics expose advance width, ink bounds and baseline distances. MDN specifically notes that italic glyph overhang can make `actualBoundingBoxLeft + actualBoundingBoxRight` exceed `width`. This matters for the italic surname near the phone edges. — [MDN TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics)
- `document.fonts.check()` reports whether a matching font specification can be used without loading a font from the set; it does not initiate a load. A nonexistent font name can return true, so this is not proof that the desired face exists. — [MDN FontFaceSet check](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check)
- MDN recommends caching repeated drawing in an offscreen canvas, avoiding repeated text rendering and `shadowBlur`, and matching backing resolution to the display size and context scale when drawing for high resolution. — [MDN Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

### Inferences
- Recommended scene: copper VB gathers, those same particle identities fan into two sampled name lines, points settle, and real lettering fills those exact strokes. Give the settled full name roughly 0.5 seconds of reading time before the existing camera departure. These are proposed choreography values, not externally validated timing thresholds.
- The current Canvas is a screen-space sibling of the stage; the existing full name sits inside a rotating/pushing CSS3D world and has separate line translations and depth. Preserve the world for photos but give the particle/name handoff one shared coordinate system, or place both on one shared transformed plane. Leaving the old slides/depth offsets on the text while only changing particle coordinates will create a mismatch. This observation comes from local inspection of `CinematicIntro.tsx`, `CinematicIntro.module.css` and `introParticleField.ts`, not a live visual test.
- Choose a ready font once when building the masks, and hold that choice for this intro. If the intended face is unavailable, use the same local serif fallback for both masks and crisp DOM text. Do not wait on an unbounded font promise, restart the animation when a font arrives, or update targets halfway through the morph. If checking the custom face, inspect the registered face/status as well as `check()`; its true result alone is insufficient.
- At 320px, keep two name lines, reserve at least a modest side gutter, and compute a common scale from the larger actual ink width. Keep the italic surname's overhang inside the gutter. Use the same line centers, baselines, weight and italic style for particle targets and final lettering.
- Preserve the current particle budgets, pixel cap and one-time mask sampling; the new effect needs more destination coordinates, not more particles or a physics package. When Canvas is unavailable or a text mask yields no samples, let the crisp DOM name appear in place on the existing fixed schedule.

### Gaps
- No mobile device, network throttling, font-load failure or Canvas failure was exercised in this research subtask. The 600/1100-particle and DPR1.5 limits are project constraints, not performance guarantees.
- The ideal particle density and minimum readable hold are aesthetic judgments requiring preview inspection; the sources do not establish a universal count or duration.

## What timing resize cleanup and reduced motion contracts must remain intact

### Takeaway
Keep the existing 3600ms escape deadline independent of particle/font work. Use elapsed-time poses with stable particle identity, recompute destination geometry on resize without restarting the clock, and remove all animation work on Skip, Escape, preference changes or unmount.

### Cited Findings
- `requestAnimationFrame()` is one-shot; its callback must schedule another frame. MDN directs animation authors to use timestamps to avoid refresh-rate-dependent speed, notes that callbacks usually pause in background tabs, and identifies cancellation via the returned request ID. — [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- The `prefers-reduced-motion` setting signals that nonessential motion should be reduced, removed or replaced. Large-scale panning and scaling can be vestibular triggers, so a quieter fade does not justify retaining the camera passage for those users. — [MDN prefers reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Inferences
- Do not replace the existing shared lifecycle or introduce storage suppression. Fresh document loads and refreshes must still replay, while Skip/Escape and reduced motion must remain immediate exits. A late font task or morph-completion callback must never extend the deadline or recreate an overlay already removed.
- Compute the morph from clamped elapsed milliseconds, with exact source and destination endpoints. Avoid an incremental spring/inertia update that depends on frame count or must catch up after a hidden-tab pause. On a resumed frame after the final deadline, clear and stop instead of replaying missed phases.
- Resize should rebuild masks/targets or their screen mapping using the same deterministic particle indices, then draw at the current elapsed time. It should not reset the sequence to VB, allocate on every frame or create another animation loop. If resize occurs after completion, its listener should already be gone.
- Retain an idempotent cleanup function: cancel the pending frame, remove resize and any newly added font listeners, ignore late promises, clear decorative Canvas, and preserve the shell's existing scroll/focus restoration. The name morph should not modify modal/dialog behavior, blog contents, contact form, or email privacy.
- Verification should add exact VB/settled-name endpoint tests and finite intermediate coordinates, check that resize keeps one frame/clock, and exercise cleanup before and during the morph. Browser checks should cover desktop and 320px, font fallback, Skip/Escape, refresh, and the final text being stationary during its in-place reveal. The existing lifecycle suite should remain green.

### Gaps
- This task performed read-only source inspection and primary-documentation research only. It did not change implementation or run tests.

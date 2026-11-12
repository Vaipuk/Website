# Cinematic portfolio opening: implementation techniques

## Which particle technique can create a distinctive wordmark without dependencies?

### Takeaway

Use a bounded Canvas 2D flight of copper particles that resolves into the actual Fraunces name. This is a genuine spatial transformation rather than another text fade. The strongest adaptation combines it with the photo-depth technique below, within one 3.6-second sequence.

### Cited Findings

- Codrops' **Interactive Particles Slideshow** demonstrates particle-built text and shapes morphing into the next composition using HTML5 Canvas. The original public demo is available. This establishes the visual technique; it does not establish a modern performance budget. — [Article](https://tympanus.net/codrops/2013/07/03/interactive-particles-slideshow/), [original demo](https://tympanus.net/Development/InteractiveParticlesSlideshow/)
- **3D Typing Effects with Three.js** explicitly begins by sampling text on Canvas to obtain 2D particle coordinates. Its later instancing/3D renderer uses Three.js; the text-mask sampling step is separable and does not require that library. — [Codrops tutorial](https://tympanus.net/codrops/2022/11/08/3d-typing-effects-with-three-js/)
- MDN recommends pre-rendering repeated primitives, batching drawing calls, avoiding expensive shadow blur and repeated text rendering, and using requestAnimationFrame for Canvas animation. — [Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- requestAnimationFrame is a one-shot callback; frame progress must use its timestamp rather than assuming 60 frames per second. Browsers normally pause it in background tabs. — [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- FontFaceSet.ready resolves once document font loading and associated layout are complete. — [Font readiness](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready)

### Inferences

- **Proposed finite choreography, not a timing claim about the demos:** 0–450ms: an oblique field of small copper particles accelerates toward a vanishing point; 450–1650ms: the field bends and assembles into the two-line Fraunces name; 1650–2450ms: hold a readable name with slight residual motion; 2450–3600ms: particles release outward and an expanding clear aperture reveals the real homepage beneath. A DOM heading can carry the readable text while the decorative canvas is aria-hidden.
- Render the text mask once, sample its alpha at a coarse grid, and retain at most **1,600 particles desktop / 700 phone**. Store position, target, delay and size in fixed arrays. Use one RAF loop and elapsed-time interpolation; avoid a React state update, object allocation, or full pixel readback each frame. These are initial implementation caps, not benchmarked guarantees. The cache/RAF choices follow [MDN's Canvas guidance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas).
- Cap backing resolution at **1.5× CSS pixels**, and consider 1.25× on narrow screens. A 1440×900 canvas at 1.5× has an **11.1MiB RGBA-equivalent pixel buffer** before renderer copies; a 1920×1080 canvas has 17.8MiB. These are arithmetic budget estimates, not measurements of browser memory. More particles increase JavaScript/draw-call work approximately with particle count; more backing pixels increase raster/compositing work. [Canvas resolution guidance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- Bound font preparation to roughly 250ms; if the desired font is not ready, use a readable DOM wordmark and continue the scene. Never make a font promise hold the dialog open. This is an application policy based on the asynchronous [font-readiness contract](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready).

### Gaps

- No hardware benchmarks were run. The particle counts, resolution caps, and timing require verification on the actual 320px/390px and desktop implementation.
- Codrops article full-text opens returned HTTP 403. Their indexed primary-source excerpts and original demo pages were available; no unseen source code was assumed or copied.

## Which image-depth technique fits the existing photography and cinematic theme?

### Takeaway

Use a short **CSS 3D print-frame/contact-sheet dive**: existing local photographs occupy several depth planes, then resolve into a composed sheet around the name before the camera passes through. Native Web Animations API transforms can supply the choreography without GSAP, Three.js, or PixiJS.

### Cited Findings

- Codrops' **On-Scroll Perspective Grid Animations** places an image grid into 3D perspective and transforms individual images into coordinated flows. — [Article](https://tympanus.net/codrops/2023/08/03/on-scroll-perspective-grid-animations/), [original demo](https://tympanus.net/Development/Scroll3DGrid/)
- **Image To Grid Transition** demonstrates a large photograph moving into its place in an image grid. Its sample uses GSAP; the concept is a source of composition rather than a dependency recommendation. — [Article](https://tympanus.net/codrops/2022/05/19/image-to-grid-transition/), [original demo](https://tympanus.net/Development/ImageToGridTransition/)
- **Creating 3D Scroll-Driven Text Animations** demonstrates a CSS perspective/preserve-3d tube with items distributed in depth. **Reactive Depth** demonstrates a more elaborate image tube with React Three Fiber and shader deformation. Both support the depth-language direction; the latter has a substantially different runtime stack from this project. — [CSS tube tutorial](https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/), [R3F image-tube tutorial](https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber/)
- Element.animate creates and starts an Animation object from keyframes and timing options. — [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
- Chromium's rendering pipeline can run visual-effect animation on the compositor when layout and paint can be skipped. This is an optimization opportunity, not a promise that every 3D scene is cheap. — [RenderingNG architecture](https://developer.chrome.com/docs/chromium/renderingng-architecture)
- preserve-3d can be forced to flatten by grouping properties, including opacity below 1, filters, clipping/masking, and overflow values other than visible or clip. It must also be applied to non-leaf descendants that need to preserve depth. — [transform-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style)
- Overusing will-change can consume excessive memory and make performance worse. — [will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change)
- Image.decode resolves when an image is decoded and ready for insertion, and can reject on download/decode failure. — [Image decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)

### Inferences

- **Standalone 3.6-second composition:** 0–600ms: 8–12 photographic print frames arrive from staggered depths, slightly rolled; 600–1700ms: a coordinated forward camera movement carries the viewer between them; 1700–2550ms: frames settle into an asymmetric contact sheet framing the name; 2550–3600ms: the central image advances past the camera while peripheral frames leave the viewport, revealing the homepage. Do not turn this into an infinite tunnel or scroll hijack. The finite sequence adapts the published perspective/grid/tube concepts rather than copying their scroll behavior. [Perspective-grid source](https://tympanus.net/codrops/2023/08/03/on-scroll-perspective-grid-animations/)
- **Recommended hybrid:** retain 8 frames on desktop / 4–6 on phones, with particle formation occurring in the central negative space. Begin the photo dive around 0.2s, resolve the wordmark around 1.4s, hold it through 2.4s, and finish the passage by 3.6s. This produces three distinct acts within one short opener, grounded in the [particle demo](https://tympanus.net/Development/InteractiveParticlesSlideshow/) and [perspective-grid demo](https://tympanus.net/Development/Scroll3DGrid/).
- Animate transform and restrained leaf opacity using precomputed WAAPI keyframes. Keep perspective and preserve-3d on an inner scene, with cropping on a separate outer wrapper; avoid opacity/filter on the preserving scene. The frame images themselves may fade at the ends. Use will-change only during this finite opener and remove it on cleanup. [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [flattening rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style), [memory caution](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change)
- Prefer 6 local thumbnail assets reused across the frames, sized around 480px wide. Twelve unique 480×320 RGBA images imply roughly **7MiB raw decoded pixels** before possible raster/GPU copies. This is an estimated lower-level budget, not total browser memory. Avoid enormous source photographs, 20+ promoted planes, full-screen blur, and per-frame layout reads. Native transform choreography reduces per-frame JavaScript work relative to a manually updated scene, while image decoding, raster layers, overdraw and GPU compositing still cost time and memory. [Rendering architecture](https://developer.chrome.com/docs/chromium/renderingng-architecture)
- True liquid/displacement transitions are a separate, higher-complexity route. Codrops' liquid version uses PixiJS+GSAP; another uses Three.js with two image textures plus a displacement texture. Native WebGL could implement the idea without a package, but shader/context/texture-loss lifecycle is a larger implementation than a bounded CSS3D/Canvas composition. Use a small procedural particle disturbance, not a new rendering engine, for this version. [Liquid distortion](https://tympanus.net/codrops/2017/10/10/liquid-distortion-effects/), [displacement-map tutorial](https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/)

### Gaps

- No claim that native WAAPI exactly reproduces shader deformation. This recommendation deliberately keeps photographs planar.
- No exact original Codrops demo named “contact sheet” was verified. The contact-sheet composition is this site's adaptation of the cited image-to-grid and perspective-grid examples.

## How should the finite opener replay safely on every fresh homepage load?

### Takeaway

Remove session-storage suppression while retaining the existing route, reduced-motion and navigation safeguards. One owner should control the 3600ms deadline and one idempotent cleanup path should stop both rendering systems.

### Cited Findings

- Current project source uses INTRO_DURATION_MS=2800, checks and writes a sessionStorage marker, limits the intro to an unanchored home route, and restores body overflow/removes listeners on cleanup. Its native dialog keeps Skip as the initial focused control. — Local evidence: `src/components/introLifecycle.ts`, `src/components/CinematicIntro.tsx` (read during this research).
- requestAnimationFrame pauses in background tabs; using its timestamp avoids refresh-rate-dependent animation speed. — [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- Animation.cancel clears an animation's effects; canceling an active animation rejects its current finished promise with AbortError. — [Animation cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel)
- prefers-reduced-motion communicates a preference to reduce or replace nonessential motion. Scaling and panning large objects may trigger vestibular discomfort. — [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Inferences

- Fresh document loads and refreshes of `/` should run again; remove both sessionStorage reads and writes. Do not add cookies, analytics, fingerprinting or new remote media. Leave privacy/blog routes and deliberate anchor/deep-link navigation unobstructed. This is the explicit requested replay behavior applied to the local lifecycle, not a browser requirement.
- Set the single lifecycle budget to 3600ms. Drive Canvas from the same elapsed-time origin as the WAAPI effects. The timeout is a fail-open guard so a lost RAF or failed asset cannot trap visitors. On a background-tab return, complete rather than replaying a long delayed spectacle. [RAF behavior](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- Preserve Skip and Escape, transfer focus to main content when explicitly skipping, restore the exact preexisting body overflow, and exit on navigation or a live reduced-motion change. Cancel the RAF, all Animation handles, timers and listeners on every exit and unmount. Guard late font/decode promises against drawing after cleanup, and handle canceled animation promises without unhandled AbortError. [Cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel)
- Reduced motion should bypass the animated dialog, or show only a brief static identity if the product explicitly needs one. Do not merely shorten the same large depth movement. Keep the canvas/images decorative and the readable name/Skip in semantic DOM. [Reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- Required verification after implementation: first load and refresh both replay; internal navigation does not unexpectedly restart; Skip/Escape release focus and scroll; reduced motion initially and mid-animation; image/font failure; 320px/390px/1440px layouts; no RAF after removal; React StrictMode setup-cleanup-setup; no new requests besides existing local assets. These are task-specific checks, not claims that the current implementation passes.

### Gaps

- Research only: no source-code changes, browser interaction, profiling or rendering verification performed in this assignment. The existing responsive work was not rechecked.

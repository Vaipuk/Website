# Initials becoming the full name

## What mechanics convey material continuity from initials to a name

### Takeaway
Keep the same copper particles visible while their destinations change from VB into the full name. The relevant creator precedents use persistent geometry or point identities; a separate title arriving from offscreen would break that relationship.

### Cited Findings
- Francesco Trillini's **Interactive Particles Slideshow** describes text and mathematical shapes constructed from Canvas particles; both morph to their next states during slide navigation. It supplies a direct precedent for changing particle arrangements instead of replacing a mark with an unrelated entrance. This finding is from the creator's indexed article text, not a new live-demo observation. — [Creator article](https://tympanus.net/codrops/2013/07/03/interactive-particles-slideshow/)
- **Particle Text Morphing** by RelaxItsAryan draws text to an offscreen canvas, reads visible pixels into target coordinates, retains sphere/text position attributes, and interpolates each particle's coordinates with a shared scalar. Its source adds an explosion term to those interpolated positions. The inspected code uses 22,000 Three.js points and GSAP; only its persistence-and-interpolation mechanic is relevant here. Its framework, quantity, fake HUD, and return-to-sphere loop are unnecessary for this site. — [Creator source, createTextTargets and animate](https://github.com/RelaxItsAryan/Particle-Text-Morphing/blob/main/script.js)
- The creator of **Letting the Creative Process Shape a WebGL Portfolio** describes transforming a rectangle into large letter-shaped masks. Initial and target paths match text dimensions; the text paths are derived from the DOM styling. The article describes moving the morph rendering to Canvas after complex SVG updates performed poorly. This is a shape-to-type precedent, not a VB-to-name implementation. Performance statements are the creator's project-specific account. — [Creator case study](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)

### Inferences
- Persistent particles can make the initials feel like compressed material that expands into the owner's name: preserve each point's identity, give it a full-name endpoint, interpolate without a complete fade or intervening explosion. This applies the first two sources' continuity principle; it is our design recommendation.
- Sample two name lines at their final display positions and hand off to solid letterforms in that same place. The portfolio case study's explicit dimension matching is useful here even though its vector morph is too heavy for this small change.
- Favor a short, restrained curved route from VB to the name over high random turbulence. The user already approved a moving photographic scene; the identity transformation should remain easy to follow inside it.
- A liquid outline morph is a valid alternative, but changing two letters into seventeen letters requires substantially more path correspondence and topology handling. The existing Canvas particle field already supplies a simpler material shared by both states.

### Gaps
- No live demos were visually inspected in this pass. The GitHub implementation was read directly; Codrops' full-page open requests returned HTTP 403, so those findings are restricted to creator text available through search retrieval.
- None of these sources is an exact initials-to-two-line personal-name design. Their transferable mechanics support an original adaptation rather than a copied animation.
- The source code's particle count and the portfolio author's frame-rate account do not establish performance for this website or physical phones.

## What timing can replace the name slides within the existing opening

### Takeaway
Make the name the next state of the VB field, followed by a brief in-place ink resolution. Keep the approved photographic composition and final camera passage; the change should replace the text entrance rather than extend the opening.

### Cited Findings
- In the particle-text source, the shape and text positions are both inputs to one coordinate calculation; the transition advances a scalar from the source toward the target. This provides a concrete mechanism for a single transformation stage instead of a second offscreen title animation. — [Creator source](https://github.com/RelaxItsAryan/Particle-Text-Morphing/blob/main/script.js)
- The Canvas slideshow uses a transformed arrangement as the settled next slide, demonstrating that a legible final state can follow a moving point field. — [Creator article](https://tympanus.net/codrops/2013/07/03/interactive-particles-slideshow/)

### Inferences
- Proposed choreography, not source-measured timing: **0–1.05s** gather VB; **1.05–1.25s** let it read; **1.25–1.95s** move the same points into two-line Vaibhav / Bharadwaj; **1.95–2.2s** points settle and solid letters resolve without translation; **2.2–2.7s** hold; **2.7–3.6s** retain the approved camera exit into the destination page.
- A short overlap between the final point positions and solid text can hide sparse sampling while showing the serif name clearly. The crisp title should share its measured bounds with the particle endpoints, so it reads as densification rather than a crossfade between different objects.
- Preserve the existing cream first name and copper italic surname if the final name's material changes gradually as points settle. The palette comes from the approved website, not these references.
- On narrow phones, keep the name on two lines and constrain its longest line within the viewport. Photos can retain their depth choreography but should not cross the identity's central reading area during the morph's final hold.
- No extra package or renderer is justified. Extend the existing finite Canvas loop, remove the two arrival transforms, and use the existing 3.6-second deadline, Skip/Escape, reduced-motion bypass, and cleanup path.

### Gaps
- Exact handoff timing and point density need visual verification in the actual composition. A mathematical morph can still look like a cloud unless the name's endpoint is readable before solid text appears.
- Device rendering, font readiness, and end-to-end focus behavior were not tested by this research task; implementation verification must cover them separately.

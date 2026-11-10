# Portfolio refinements

Preserved the approved composition, palette, and display typography. Changed body type to Satoshi, verified that the actual font files load, and kept Switzer for display text.

Requested changes:
- Font-dependent arrows replaced by shared SVG icons, including dynamically rendered repository links and project selection arrows.
- Six project tiles float independently by 6px in each direction using transform-only CSS. Hover/focus pauses the individual tile; a global pause button, offscreen pausing, hidden-tab pausing, and reduced-motion support are included.
- Hero headline now reads “Ideas into real software.” The supporting introduction names the software-engineering role and the current university work.
- Kept “A builder, still learning.” Changed only its following lead paragraph, as clarified by the user.
- Replaced route-type controls with 12 selectable stops, start/destination selection, a Run route action, actual shortest-path calculation, animated travel, arrival feedback, and reset/cancellation.

Validation:
- 56 functional browser checks passed against the production build, including route selection, duplicate-stop handling, arrival, reset during travel, SVG references, actual font loading, ambient motion controls, and reduced motion.
- Three routing tests passed, including an independent Floyd–Warshall comparison for every one of the 144 endpoint pairs.
- Responsive browser checks cover 1440, 768, 390, and 320px, including route control bounds. No uncaught browser errors were observed.
- Final visual inspector: 0 FAIL at 1440, 768, and 390px. Reviewed every emitted responsive screenshot and the route preview.
- Remaining inspector warnings: different display/control text sizes; no video because working previews carry the motion; text-margin measurement excludes the header's rightmost arrow icon. The no-raster-picture allowance carries forward from the approved code-native design.
- No physical mobile-device test was performed.

Visual critique: the approved split-stage idea remains intact. The six-way explorer still represents the breadth of the portfolio. Satoshi gives the body text a lighter and more open rhythm, and the shorter hero headline fits on two lines at every checked width. Mobile route controls remain inside the preview and stay usable. No unrelated copy was revised.

Source and dist/ are updated in the GitHub checkout. No GitHub commit or push was performed during this refinement.

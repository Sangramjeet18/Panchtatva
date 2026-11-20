# EcoSense UI/UX Design Brief

## 1. Direction
An editorial, field-report look: large real photographs, a serif headline voice, calm earth colours, flat surfaces, thin lines. It should feel like a well made environmental journal that also works as a tool. The photos carry the emotion, the interface stays quiet.

## 2. The 30 rules, applied as an AVOID list
Treat every item below as forbidden unless marked "required".

1. Harsh gradients: none. All fills are flat colours. Photo overlays are one flat translucent colour.
2. Lucide icons: none. No icon library. Use text labels and numerals.
3. Pure white background: never use #FFFFFF as a page background. Use warm paper.
4. Rainbow colouring: none. Maximum one accent per module.
5. Drop shadows: none. Separation comes from 1px lines and spacing.
6. Three feature cards in a row: none. Modules appear as full width alternating rows.
7. Emojis: none anywhere, including headings, buttons and docs.
8. Liquid glass and blur panels: none.
9. Em dashes: never in any text. Use commas, periods or colons.
10. Inter, Geist, Space Grotesk: not allowed. Use Fraunces (headings) and Instrument Sans (body).
11. Coloured left stripe on cards or quotes: none.
12. Fake testimonials: none. No invented quotes, names, logos or user counts.
13. Bento grids: none.
14. Terminal window mockups: none.
15. The "it is not X, it is Y" sentence pattern: none. State what the thing does directly.
16. Checkmark bullets: none. Use plain paragraphs or numbered lists.
17. Three pricing tiers: none. The site is free; no pricing section.
18. No real product demos: reversed. Required: every module page and the Home page contain a working demo.
19. Soft corner radius: avoid. Radius is 0 to 2px.
20. Purple and black: no purple. No black backgrounds. Dark mode uses deep green ink.
21. No skeleton loaders: reversed. Required: skeleton loaders on every data region while loading.
22. Radial orbs: none.
23. Dot grids: none.
24. Sparkle icons: none.
25. Animated arrows: none. Links are underlined text.
26. No Terms of Service: reversed. Required: a Terms page.
27. No Privacy Policy: reversed. Required: a Privacy page.
28. Hover animations: none. Hover and focus change colour or underline instantly, no transitions, no movement.
29. Neon colours: none.
30. Basic pastel colours: none. Colours are muted, earthy and slightly dark.

## 3. Colour tokens
| Token | Light | Dark |
|---|---|---|
| --paper | #F2EDE2 | #121A15 |
| --surface | #E9E2D3 | #1A251E |
| --ink | #16231B | #EDE7D9 |
| --muted | #55625A | #A9B3A8 |
| --line | #CFC6B3 | #2E3C33 |
| --forest (primary) | #1E4D35 | #7FB08F |
| --clay (alert, deforestation) | #B4532A | #D98A63 |
| --river (waterlogging) | #2F5D73 | #7FAFC4 |
| --smoke (carbon) | #3A3F3C | #B9BFBA |
Risk scale: Low #5B7B3A, Medium #B88A1E, High #B4532A (text always accompanies colour).

## 4. Type
- Headings: Fraunces, weights 500 and 600, tight leading 1.05 to 1.15. Display size 64 to 88px desktop.
- Body: Instrument Sans 17px, leading 1.6. Max line length 68 characters.
- Numbers in data: Instrument Sans with tabular figures.

## 5. Layout and spacing
12 column grid, 1200px max content width, 8px spacing scale, section padding 96px desktop and 56px mobile. Full bleed photo bands are allowed. Buttons: rectangular, 2px radius, 48px high, solid forest fill with paper text, secondary is 1px ink outline.

## 6. Imagery
- Deforestation photo: Home hero and Deforestation page header.
- Seedlings photo: Reforestation page header and Home module row 2.
- Two industrial photos: Carbon page header (one full bleed, one inset) and Home module row 3.
- Flooded street photo: Waterlogging page header and Home module row 4.
Images get a flat 30 to 45 percent dark overlay only when text sits on them. Always provide alt text describing the scene.

## 7. Home page structure
1. Nav: wordmark, four module links, About.
2. Hero: full bleed deforestation photo, headline, one sentence on what EcoSense does, two buttons (Try the carbon calculator, How it works).
3. "What EcoSense does": one plain paragraph, then four alternating rows (image and text) one per module, each with problem, what you can do, what you get.
4. Live demo: working carbon footprint calculator with trees-needed result.
5. How it works: four numbered steps (collect, model, predict, act).
6. Data and honesty note: which data is real, which is simulated.
7. Footer: Terms, Privacy, Data Sources, repository link.

## 8. About page
Mission in two paragraphs, the four modules, method summary, data sources, limits, team and project context (EVS project), contact placeholder.

## 9. Module page template
Photo header band, one line problem statement, control panel on the left (or on top on mobile), results on the right: chart or map first, numbers second, method note third. Skeleton loader matches the chart or map footprint.

## 10. Interaction and states
Instant updates on input change (debounced 250ms). Skeleton, empty, error and success states for every data region. Focus ring 2px clay offset 2px. Minimum touch target 44px. Respect prefers-reduced-motion (there is no motion to remove).

## 11. Accessibility
Contrast AA minimum, semantic landmarks, labelled inputs, chart text summaries, map has a table alternative, skip link.

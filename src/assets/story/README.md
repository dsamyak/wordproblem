# Story slide art brief — "Priya's Sticker Adventure"

Replace `1.png` – `4.png` in this folder with final artwork. Each file is
imported directly by `src/features/story/StoryPhase.jsx`.

## Image specs
- **Size: 2000 × 800 px** (landscape, ~2.5 : 1) — matches the reference
  module's shipped story images exactly, so no layout change is needed.
- Format: PNG (or JPG), landscape orientation.
- The frame that displays these images is CSS-capped at `max-width: 660px`
  with a fixed height of **210px on desktop, 175px on tablets (≤768px),
  and 140px on phones (≤480px)**, using `object-fit: cover`. Keep the main
  subject centred, since the sides/top/bottom may be cropped on narrow
  screens — avoid putting important detail near the edges.
- Rounded top corners are applied automatically by CSS — no need to bake
  those into the artwork.

## Scene briefs

**1.png — "Priya's Sticker Puzzle"**
Priya (young Primary 1 girl, school uniform) sitting at a classroom desk,
looking curiously at two loose groups of stickers spread in front of her —
6 red star stickers on one side, 4 blue star stickers on the other — a
thought bubble with a question mark above her head. Bright, friendly
classroom lighting.

**2.png — "Combining Two Groups!"**
Wei Ming (young Primary 1 boy) standing beside Priya, using both hands to
push the red sticker group and the blue sticker group together into one
combined group on the desk, both children smiling as the stickers merge.
A big "6 + 4 = 10" sparkle effect above the combined group.

**3.png — "The Bar Model Secret"**
Farhan (young Primary 1 boy) drawing on a whiteboard or large notepad —
two small rectangular bars side by side (one labelled 6, one labelled 4)
sitting above one longer bar (labelled 10), with Priya and Wei Ming
looking on, delighted, pointing at the bars.

**4.png — "Ready to Solve Together!"**
Priya closing her sticker book with a big proud smile, giving Wei Ming and
Farhan a high-five, with Bobo the Monkey mascot swinging in from the side
cheering with confetti and a small number-line doodle in the background.
Bright, celebratory colour palette.

## Placeholders
Until final art is ready, this folder ships with generated placeholder
images at the correct 2000×800px size (gradient background + themed
vector icon + slide title) so the module runs and displays correctly out
of the box.

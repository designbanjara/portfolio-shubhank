# Portfolio Design System Plugin

Generates the full design system in the "Claude test - portfolio" Figma file.

## How to run

1. Open Figma desktop app
2. Menu → **Plugins** → **Development** → **Import plugin from manifest...**
3. Select `figma-design-system/manifest.json` from this project folder
4. Open the **Claude test - portfolio** file
5. Menu → **Plugins** → **Development** → **Portfolio Design System Builder**
6. Plugin runs and closes automatically (~5 seconds)

## What gets created

### Variable Collections (Design Tokens)
| Collection | Contents |
|---|---|
| 🎨 Colors | 17 semantic color tokens (Background, Text, Brand, Border, State, Overlay) |
| 📐 Spacing | 11 spacing steps (4–64px, base unit 4px) |
| ⬛ Radii | 5 border-radius values (SM 4px → Full 9999px) |
| 🔤 Typography | 12 tokens (font sizes, weights, line heights) |

### Reference Frames (Visual Documentation)
| Frame | Contents |
|---|---|
| 🎨 Color Palette | All color swatches in 4 groups with hex values |
| 🔤 Typography Scale | Full type scale with live samples + specs |
| 📐 Spacing & Radii | Visual spacing blocks + radius previews |
| 🧩 Components | Nav Cards, Bottom Nav, Social Links, Buttons, Badges, Post Card |

## Color Tokens Reference

| Token | Hex | Usage |
|---|---|---|
| Background/Page | `#0D0D0D` | Page background |
| Background/Card | `#141414` | Card surfaces |
| Background/Sidebar | `#1A1A1A` | Sidebar background |
| Background/Nav-Inactive | `#2A2A2A` | Inactive nav items |
| Background/Nav-Hover | `#333333` | Hover states |
| Brand/Primary | `#4A9EFF` | Links, portfolio accent |
| Brand/Primary-Light | `#60A5FA` | Link color in content |
| Brand/Primary-Dark | `#2563EB` | Buttons, active nav |
| Brand/Accent | `#F97316` | Orange accent (from CSS) |

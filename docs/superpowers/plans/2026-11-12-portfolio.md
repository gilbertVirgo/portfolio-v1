# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build gilbertvirgo.co.uk: a single long-scroll page showing six projects in device mockups, an about block and a contact form that emails Gil.

**Architecture:** Vite + React + TypeScript, one page, no router. The approved artboard (`design/artboard/Main.dc.html`) is ported section by section into React components; its inline styles are kept verbatim through a small `st()` helper. Two looping mock animations are pure `beat → view state` functions with thin renderers. One Netlify Function sends the contact email over Gmail SMTP.

**Tech Stack:** Vite, React 18, TypeScript, Vitest, nodemailer, Netlify Functions (v2, `Request`/`Response`).

**Spec:** `docs/superpowers/specs/2026-11-12-portfolio-design.md`

## Global Constraints

- The artboard file `design/artboard/Main.dc.html` is the source of truth for markup, copy, colours and sizes. Port it; do not redesign.
- Project order on the page: Christian Heritage London, Life Church Richmond, Stanza, Selhurst Church, Victoria Park Community Church, Highbury Baptist Church. Real DOM order (the artboard uses CSS `order`; do not).
- Fonts: `<link rel="stylesheet" href="https://use.typekit.net/jnj6xdu.css">`, family `'sets-grotesk-l', 'Inter Tight', system-ui, sans-serif`. Google Fonts link for `Inter Tight` 400/500/600/700, `Inter` 500/600, `Figtree` 500/600/700, `EB Garamond`.
- Page-level fluid sizes use `cqw` against a root with `container-type: inline-size`, exactly as the artboard does.
- No infinite CSS `transform`/`opacity` keyframe animations anywhere (Safari compositing-layer leak). Animation is a JS interval plus CSS transitions on `left`, `top`, `background`.
- Animations: 1300 ms per beat; paused off screen; no ticking under `prefers-reduced-motion: reduce`.
- No song lyrics in the Stanza mock; song slides are bars.
- No new dependencies beyond: `react`, `react-dom`, `nodemailer`, and dev `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `@types/react`, `@types/react-dom`, `@types/nodemailer`, `@netlify/functions`.
- Secrets (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) live only in Netlify env. Never in the repo.
- Commit after each task. Branch `build-site` off `main`.

## File Structure

```
index.html                     fonts, meta, root
netlify.toml                   build + functions dir
src/main.tsx                   mount
src/App.tsx                    page shell: header, projects, about, contact
src/styles.css                 reset, root container, link styles
src/st.ts                      st(): CSS string -> React style object
src/projects.tsx               typed project data array (order = page order)
src/ProjectSection.tsx         meta row + title + stage
src/devices.tsx                Laptop, Tablet, Phone frames, Capture screen
src/useBeat.ts                 interval + IntersectionObserver + reduced motion
src/booking/frame.ts           bookingFrame(t) pure function
src/booking/frame.test.ts
src/booking/BookingJourney.tsx renderer
src/stanza/frame.ts            stanzaFrame(t) pure function
src/stanza/frame.test.ts
src/stanza/StanzaJourney.tsx   renderer
src/ContactForm.tsx            form + client states
src/assets/                    moved from design/assets/
netlify/functions/contact.ts   validate() + handler
netlify/functions/contact.test.ts
```

---

### Task 1: Scaffold, base styles, header

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `netlify.toml`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/st.ts`, `src/st.test.ts`
- Move: `design/assets/*` → `src/assets/`

**Interfaces:**
- Produces: `st(css: string): React.CSSProperties` from `src/st.ts`; `App` default export; root element `.page` with `container-type: inline-size`.

- [ ] **Step 1: Branch and scaffold**

```bash
git checkout -b build-site
npm create vite@latest . -- --template react-ts
npm install
npm install nodemailer
npm install -D vitest @types/nodemailer @netlify/functions
mkdir -p src/assets && mv design/assets/* src/assets/ && rmdir design/assets
rm -rf src/App.css src/index.css src/assets/react.svg public/vite.svg
```

If `npm create vite` refuses a non-empty directory, choose "Ignore files and continue".

- [ ] **Step 2: Add test script and Vitest include**

In `package.json` scripts add `"test": "vitest run"`. Replace `vite.config.ts` with:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { include: ['src/**/*.test.ts', 'netlify/**/*.test.ts'] },
})
```

- [ ] **Step 3: Write the failing test for `st()`**

`src/st.test.ts`:

```ts
import { expect, test } from 'vitest'
import { st } from './st'

test('parses a CSS declaration string into a React style object', () => {
  expect(st('aspect-ratio: 16 / 10; border-top: 1px solid #3a3a3a; left: 50%')).toEqual({
    aspectRatio: '16 / 10',
    borderTop: '1px solid #3a3a3a',
    left: '50%',
  })
})

test('keeps colons inside values and ignores empty declarations', () => {
  expect(st('background-image: url(a:b);;')).toEqual({ backgroundImage: 'url(a:b)' })
})
```

- [ ] **Step 4: Run it, expect failure**

Run: `npm test` — Expected: FAIL, cannot resolve `./st`.

- [ ] **Step 5: Implement `st()`**

`src/st.ts`:

```ts
import type { CSSProperties } from 'react'

// Lets the artboard's inline style strings be pasted into JSX unchanged.
export function st(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    if (prop) out[prop] = decl.slice(i + 1).trim()
  }
  return out as CSSProperties
}
```

- [ ] **Step 6: Run it, expect pass**

Run: `npm test` — Expected: 2 passed.

- [ ] **Step 7: `index.html`, styles, shell**

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gil Virgo — identity, websites and software for churches and charities</title>
    <meta name="description" content="Gil Virgo designs and builds visual identities, websites and software for churches and charities in London." />
    <link rel="stylesheet" href="https://use.typekit.net/jnj6xdu.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@500;600&family=Figtree:wght@500;600;700&family=EB+Garamond&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/styles.css`:

```css
* { box-sizing: border-box; }
body { margin: 0; background: #fff; }
a { color: inherit; }
a:hover { text-decoration-thickness: 2px; }
.page {
  container-type: inline-size;
  font-family: 'sets-grotesk-l', 'Inter Tight', system-ui, sans-serif;
  background: #fff; color: #0a0a0a;
  font-size: 15px; line-height: 1.35; letter-spacing: -0.01em;
}
:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
```

`src/App.tsx` — port the header from artboard lines 21–31. "Gil Virgo" becomes the page `h1` (same styles, `margin: 0; font-size: inherit`):

```tsx
import { st } from './st'

export default function App() {
  return (
    <div className="page" id="top">
      <header style={st('display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: space-between; align-items: baseline; padding: 20px clamp(16px, 2.5cqw, 36px)')}>
        <h1 style={st('margin: 0; font-size: inherit; font-weight: 600; flex: 1 1 160px')}>Gil Virgo</h1>
        <p style={st('margin: 0; flex: 2 1 280px')}>Identity, websites and software for churches and charities.</p>
        <nav style={st('display: flex; gap: 24px; flex: 1 1 200px; justify-content: flex-end')}>
          <a href="#work" style={st('text-decoration: none; padding: 12px 0')}>Work</a>
          <a href="#about" style={st('text-decoration: none; padding: 12px 0')}>About</a>
          <a href="#contact" style={st('padding: 12px 0')}>Start a project</a>
        </nav>
      </header>
      <main id="work" />
    </div>
  )
}
```

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
```

Ensure `.gitignore` has `node_modules`, `dist`, `.netlify`, `.env*`.

- [ ] **Step 8: Verify and commit**

Run: `npm run build && npm test` — Expected: build succeeds, 2 tests pass.
Run: `npm run dev`, open the page: header row shows in Sets Grotesk (or Inter Tight on localhost if the kit rejects the domain).

```bash
git add -A && git commit -m "feat: scaffold site, base styles, header"
```

---

### Task 2: Devices, project data, static project sections

**Files:**
- Create: `src/devices.tsx`, `src/projects.tsx`, `src/ProjectSection.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `st()`.
- Produces:
  - `Laptop({ children, outline? }: { children: ReactNode; outline?: boolean })`, `Tablet({ children })`, `Phone({ children })` — bezel only; the child is the screen.
  - `Capture({ src, alt, label, ratio, bg, radius }: { src: string; alt: string; label: string; ratio: string; bg: string; radius: string })` — scrollable screen holding one capture image.
  - `type Project = { id: string; title: string; bg: string; fg: string; disciplines: string; links: ReactNode; stage: ReactNode; bleed?: boolean }`
  - `projects: Project[]` in page order. For now `chl` and `stanza` stages render `null` where the animation goes; Tasks 3 and 4 fill them.

- [ ] **Step 1: Device frames**

`src/devices.tsx` (styles lifted from artboard lines 43–52 and 124–127):

```tsx
import type { ReactNode } from 'react'
import { st } from './st'

export function Laptop({ children, outline }: { children: ReactNode; outline?: boolean }) {
  const edge = outline ? '; border: 1px solid #5a5a5a' : ''
  return (
    <div style={st('flex: 4 1 420px; min-width: 0')}>
      <div style={st('background: #0d0d0d; padding: 1.4%; border-radius: 18px 18px 0 0' + edge + (outline ? '; border-bottom: 0' : ''))}>{children}</div>
      <div style={st('height: 14px; background: #0d0d0d; border-top: 1px solid #3a3a3a; border-radius: 0 0 14px 14px; margin: 0 -2%' + edge)} />
    </div>
  )
}

export function Tablet({ children }: { children: ReactNode }) {
  return <div style={st('flex: 1.4 1 260px; max-width: 380px; min-width: 0; background: #0d0d0d; padding: 10px; border-radius: 22px')}>{children}</div>
}

export function Phone({ children }: { children: ReactNode }) {
  return <div style={st('flex: 1 1 160px; max-width: 270px; min-width: 0; background: #0d0d0d; padding: 8px; border-radius: 34px')}>{children}</div>
}

export function Capture(p: { src: string; alt: string; label: string; ratio: string; bg: string; radius: string }) {
  return (
    <div tabIndex={0} role="region" aria-label={p.label} style={st(`aspect-ratio: ${p.ratio}; overflow-y: auto; background: ${p.bg}; border-radius: ${p.radius}`)}>
      <img src={p.src} alt={p.alt} loading="lazy" style={st('width: 100%; display: block')} />
    </div>
  )
}
```

Ratios and radii: laptop screen `16 / 10`, `4px`; phone screen `9 / 19`, `26px`.

- [ ] **Step 2: Section component**

`src/ProjectSection.tsx` (meta row + title from artboard lines 35–41; the Life Church section, lines 324–333, has no side padding on the section so its strip can bleed — that is `bleed`):

```tsx
import type { Project } from './projects'
import { st } from './st'

const PAD = 'clamp(16px, 2.5cqw, 36px)'

export function ProjectSection({ p, index, total }: { p: Project; index: number; total: number }) {
  const n = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0')
  const head = (
    <>
      <div style={st(`display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid ${p.fg}`)}>
        <span style={st('flex: 1 1 160px')}>{n}</span>
        <span style={st('flex: 2 1 280px')}>{p.disciplines}</span>
        <span style={st('flex: 1 1 200px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px')}>{p.links}</span>
      </div>
      <h2 style={st('margin: clamp(24px, 3cqw, 40px) 0 clamp(28px, 4.5cqw, 64px); font-size: clamp(48px, 11cqw, 168px); font-weight: 600; line-height: 0.88; letter-spacing: -0.02em')}>{p.title}</h2>
    </>
  )
  return (
    <section id={p.id} style={st(`background: ${p.bg}; color: ${p.fg}; padding: 0 ${p.bleed ? '0' : PAD} 112px`)}>
      {p.bleed ? <div style={st(`padding: 0 ${PAD}`)}>{head}</div> : head}
      {p.bleed ? p.stage : <div style={st('display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-end')}>{p.stage}</div>}
    </section>
  )
}
```

- [ ] **Step 3: Project data**

`src/projects.tsx`. Import every asset from `./assets/…`. One entry per project in page order with these exact values:

| id | title | bg | fg | disciplines |
|----|-------|----|----|-------------|
| `chl` | Christian Heritage London | `#A8192E` | `#ffffff` | Visual identity, website and booking system |
| `lcr` | Life Church Richmond | `#0B2A2E` | `#FFFDF0` | Visual identity |
| `stanza` | Stanza | `#2f2d2e` | `#FAFAFA` | Desktop presentation app for churches |
| `selhurst` | Selhurst Church | `#E5D87B` | `#231820` | Visual identity, website, photography and videography |
| `vpcc` | Victoria Park Community Church | `#F47A2B` | `#0B0A10` | Visual identity and website |
| `hbc` | Highbury Baptist Church | `#FFFCED` | `#1E1F1B` | Visual identity, website, photography and videography |

`links` and `stage` per project, ported from the artboard (line ranges are in `design/artboard/Main.dc.html`; replace each `/_blob/…` URL with the imported asset named here, and copy each `alt` and `aria-label` verbatim):

- `chl` — links: two anchors (lines 39–40). Stage: `<Laptop><Capture src={chlDesktop} …/></Laptop>`, `<Tablet>{null}</Tablet>` (Task 3), `<Phone><Capture src={chlMobile} …/></Phone>` (lines 43–127; assets `chl-desktop.jpg`, `chl-mobile.jpg`; screen bg `#ffffff`).
- `lcr` — links: `<span>Logo, banners, signage</span>`. `bleed: true`. Stage: the sideways strip, lines 333–358, six `<figure>`s using `lcr-plaque.png`, `lcr-welcome.png`, `lcr-roller1.png`, `lcr-roller2.png`, `lcr-prayer.png`, `lcr-logos.png`, captions verbatim.
- `stanza` — links: `<span>Beta — v0.1.11</span>`. Stage: `<Laptop outline>{null}</Laptop>` (Task 4) plus the text column, lines 288–294 (`stanza-icon.svg`, pitch paragraph, download anchor to `https://github.com/gilbertVirgo/praise-pres-releases/releases/tag/v0.1.11`).
- `selhurst` — links: anchor to `https://selhurstchurch.org` and `<span>Full site in progress</span>`. Stage: `<Laptop><Capture src={scHome} bg="#FFFEF2" …/></Laptop>` and the logo `<img>` (line 150, `selhurst-logo-dark.svg`).
- `vpcc` — link to `https://vpcc.church`. Stage: laptop `vpcc-desktop.jpg`, phone `vpcc-mobile.jpg`, bg `#FCFCF5`.
- `hbc` — link to `https://highburybaptistchurch.org`. Stage: laptop `hbc-desktop.jpg`, phone `hbc-mobile.jpg`, bg `#FFFCED`.

Shape:

```tsx
import type { ReactNode } from 'react'

export type Project = { id: string; title: string; bg: string; fg: string; disciplines: string; links: ReactNode; stage: ReactNode; bleed?: boolean }

export const projects: Project[] = [ /* six entries as specified above */ ]
```

- [ ] **Step 4: Render sections**

In `src/App.tsx` replace `<main id="work" />` with:

```tsx
<main id="work">
  {projects.map((p, i) => <ProjectSection key={p.id} p={p} index={i} total={projects.length} />)}
</main>
```

- [ ] **Step 5: Verify and commit**

Run: `npm run build` — Expected: succeeds, no TS errors.
Run: `npm run dev`. Check against the artboard at 1440, 768 and 390 widths: six sections in the stated order, counters `01 / 06` … `06 / 06`, every capture scrolls inside its device, Life Church strip scrolls sideways and bleeds to the page edge, no horizontal page scroll at 390.

```bash
git add -A && git commit -m "feat: device frames and six project sections"
```

---

### Task 3: Beat hook and CHL booking animation

**Files:**
- Create: `src/useBeat.ts`, `src/booking/frame.ts`, `src/booking/frame.test.ts`, `src/booking/BookingJourney.tsx`
- Modify: `src/projects.tsx` (fill the CHL `<Tablet>`)

**Interfaces:**
- Produces:
  - `useBeat(ms?: number): [ref: RefObject<HTMLDivElement>, beat: number]` — beat increments every `ms` (default 1300) while the ref'd element is on screen; stays 0 under reduced motion.
  - `bookingFrame(t: number): BookingFrame` where

```ts
export type Day = { n: number; bg: string; fg: string; dot: string }
export type BookingFrame = {
  screen: 'size' | 'calendar' | 'details' | 'review' | 'done'
  steps: [string, string, string]   // colours of progress dashes 2–4
  size: number
  days: Day[]; picked: boolean
  name: string; email: string; phone: string
  payBorder: string; payMark: string
  btn: string
  cx: string; cy: string
}
```

- [ ] **Step 1: Write the failing tests**

`src/booking/frame.test.ts`:

```ts
import { expect, test } from 'vitest'
import { bookingFrame } from './frame'

test('loops every 13 beats', () => {
  expect(bookingFrame(13)).toEqual(bookingFrame(0))
})

test('walks size → calendar → details → review → done', () => {
  const screens = Array.from({ length: 13 }, (_, t) => bookingFrame(t).screen)
  expect(screens).toEqual(['size', 'size', 'size', 'calendar', 'calendar', 'details', 'details', 'details', 'details', 'review', 'review', 'done', 'done'])
})

test('group size counts 1, 2, 3', () => {
  expect([0, 1, 2].map((t) => bookingFrame(t).size)).toEqual([1, 2, 3])
})

test('cursor reaches a control one beat before it reacts', () => {
  // beat 3: cursor is on day 13, not yet picked; beat 4: picked
  expect(bookingFrame(3).picked).toBe(false)
  expect([bookingFrame(3).cx, bookingFrame(3).cy]).toEqual(['75.5%', '40.4%'])
  expect(bookingFrame(4).picked).toBe(true)
  expect(bookingFrame(4).days[12]).toMatchObject({ n: 13, bg: '#A8192E', fg: '#ffffff' })
})

test('details fill in one field per beat', () => {
  expect(bookingFrame(5)).toMatchObject({ name: '', email: '', phone: '' })
  expect(bookingFrame(8)).toMatchObject({ name: 'Sam Taylor', email: 'sam@example.org', phone: '07700 900123' })
})

test('every beat is complete', () => {
  for (let t = 0; t < 13; t++) {
    const f = bookingFrame(t)
    expect(f.days).toHaveLength(28)
    expect(f.cx).toMatch(/%$/)
    expect(f.btn).not.toBe('')
  }
})
```

- [ ] **Step 2: Run, expect failure**

Run: `npm test` — Expected: FAIL, cannot resolve `./frame`.

- [ ] **Step 3: Implement `bookingFrame`**

`src/booking/frame.ts`: port artboard lines 420–445 (`const f = t % 13;` through the `b` object). Changes from the artboard code, and only these:

- Return `screen` as `(['size', 'calendar', 'details', 'review', 'done'] as const)[screenIndex]` instead of the five `is…` booleans.
- Return `steps: [p2, p3, p4]`.
- Drop `pressed` and `btnBg` (the button is always `#A8192E`).
- Add the `Day` and `BookingFrame` types from the Interfaces block and annotate the return.

- [ ] **Step 4: Run, expect pass**

Run: `npm test` — Expected: all booking tests pass.

- [ ] **Step 5: `useBeat`**

`src/useBeat.ts`:

```ts
import { useEffect, useRef, useState } from 'react'

export function useBeat(ms = 1300) {
  const ref = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id: ReturnType<typeof setInterval> | undefined
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      id = e.isIntersecting ? setInterval(() => setBeat((b) => b + 1), ms) : undefined
    })
    if (ref.current) io.observe(ref.current)
    return () => { clearInterval(id); io.disconnect() }
  }, [ms])
  return [ref, beat] as const
}
```

- [ ] **Step 6: Renderer**

`src/booking/BookingJourney.tsx`: port artboard lines 55–120 (the `role="img"` element and everything inside it) into one component.

```tsx
import { useBeat } from '../useBeat'
import { st } from '../st'
import { bookingFrame } from './frame'
import logo from '../assets/chl-logo.svg'

export function BookingJourney() {
  const [ref, beat] = useBeat()
  const b = bookingFrame(beat)
  return (
    <div ref={ref} role="img" aria-label="Animated walkthrough of the booking system: choose group size, pick a walk on the calendar, enter details, review, success" style={st('position: relative; aspect-ratio: 3 / 4; overflow: hidden; container-type: inline-size; background: #ffffff; color: #282828; border-radius: 12px; letter-spacing: 0; display: flex; flex-direction: column')}>
      {/* header, five screens, footer button, cursor — ported from the artboard */}
    </div>
  )
}
```

Porting rules (apply to every element in the range):

- `style="…"` → `style={st('…')}`; a style containing `{{b.x}}` → a template literal: `st(\`… background: ${b.steps[0]}\`)`.
- `{{b.p2}}`, `{{b.p3}}`, `{{b.p4}}` → `b.steps[0]`, `b.steps[1]`, `b.steps[2]`.
- `<sc-if value="{{b.isSize}}">…</sc-if>` → `{b.screen === 'size' && (<>…</>)}`; likewise `isCal` → `'calendar'`, `isDetails` → `'details'`, `isReview` → `'review'`, `isDone` → `'done'`; the nested `{{b.picked}}` block → `{b.picked && (…)}`.
- `<sc-for list="{{b.days}}" as="d">` → `{b.days.map((d) => <span key={d.n} …>…</span>)}`.
- Footer button background is the literal `#A8192E`.
- Everything inside is decorative: add `aria-hidden="true"` to the outer header, content and footer wrappers so the single `role="img"` label is what assistive tech reads. The logo `<img>` keeps `alt=""`.
- SVG attributes to camelCase (`stroke-width` → `strokeWidth`, etc.).

- [ ] **Step 7: Wire in**

In `src/projects.tsx`, CHL stage: `<Tablet><BookingJourney /></Tablet>`.

- [ ] **Step 8: Verify and commit**

Run: `npm run build && npm test` — Expected: pass.
Run: `npm run dev`. The CHL tablet loops the journey; the cursor dot sits on `+`, the Saturday 13 cell, each field, the pay option and the bottom button before each reacts. Scroll the section off screen for 10 s and back: it resumes rather than having jumped far ahead. With macOS "Reduce motion" on and a reload, it shows the first screen and does not move.

```bash
git add -A && git commit -m "feat: CHL booking journey animation"
```

---

### Task 4: Stanza animation

**Files:**
- Create: `src/stanza/frame.ts`, `src/stanza/frame.test.ts`, `src/stanza/StanzaJourney.tsx`
- Modify: `src/projects.tsx` (fill the Stanza `<Laptop>`)

**Interfaces:**
- Consumes: `useBeat`, `st`.
- Produces: `stanzaFrame(t: number): StanzaFrame` where

```ts
export type RailRow =
  | { kind: 'head'; title: string; caret: string }
  | { kind: 'thumb'; n: number; text: string; bar: string; w1: string; w2: string; pill: string; pillBg: string; wash: string; ring: string }
export type SongRow = { title: string; bg: string; addBg: string; addFg: string }
export type StanzaFrame = {
  rows: RailRow[]
  menu: boolean; hiSong: string; hiBible: string
  songModal: boolean; q: string; qInk: string; songs: SongRow[]; songCount: string
  bibleModal: boolean; ref: string; refInk: string; pvRef: string; pvTr: string; pvText: string; readBg: string
  stage: 'text' | 'song' | 'bible'; verseNo: string; verse: string; stageLabel: string
  live: boolean
  cx: string; cy: string
}
```

- [ ] **Step 1: Write the failing tests**

`src/stanza/frame.test.ts`:

```ts
import { expect, test } from 'vitest'
import { stanzaFrame } from './frame'

const titles = (t: number) => stanzaFrame(t).rows.flatMap((r) => (r.kind === 'head' ? [r.title] : []))

test('loops every 16 beats', () => {
  expect(stanzaFrame(16)).toEqual(stanzaFrame(0))
})

test('overlays open in order: menu, song modal, menu, bible modal', () => {
  const overlay = Array.from({ length: 16 }, (_, t) => {
    const f = stanzaFrame(t)
    return f.menu ? 'menu' : f.songModal ? 'song' : f.bibleModal ? 'bible' : '-'
  })
  expect(overlay).toEqual(['-', 'menu', 'song', 'song', 'song', '-', 'menu', 'bible', 'bible', 'bible', 'bible', '-', '-', '-', '-', '-'])
})

test('rail gains the song, then the reading', () => {
  expect(titles(0)).toEqual(['Welcome'])
  expect(titles(5)).toEqual(['Welcome', 'Be Thou My Vision'])
  expect(titles(11)).toEqual(['Welcome', 'Be Thou My Vision', 'John 3:16–17 · KJV'])
})

test('song search filters to one result', () => {
  expect(stanzaFrame(2).songs).toHaveLength(5)
  expect(stanzaFrame(3).songs.map((s) => s.title)).toEqual(['Be Thou My Vision'])
  expect(stanzaFrame(3).q).toBe('be thou')
})

test('bible preview: empty, fetching, then verse', () => {
  expect(stanzaFrame(7).pvText).toBe('')
  expect(stanzaFrame(8).pvText).toBe('Fetching verses…')
  expect(stanzaFrame(9).pvText).toMatch(/^For God so loved the world/)
})

test('stage follows content and goes live at beat 13', () => {
  expect([0, 5, 11].map((t) => stanzaFrame(t).stage)).toEqual(['text', 'song', 'bible'])
  expect(stanzaFrame(12).verseNo).toBe('17')
  expect(stanzaFrame(12).live).toBe(false)
  expect(stanzaFrame(13).live).toBe(true)
})

test('song slides carry bars, never text', () => {
  const songThumbs = stanzaFrame(5).rows.filter((r) => r.kind === 'thumb' && r.pill !== '')
  expect(songThumbs).toHaveLength(3)
  for (const r of songThumbs) if (r.kind === 'thumb') expect(r.text).toBe('')
})
```

- [ ] **Step 2: Run, expect failure**

Run: `npm test` — Expected: FAIL, cannot resolve `./frame`.

- [ ] **Step 3: Implement `stanzaFrame`**

`src/stanza/frame.ts`: port artboard lines 447–503 (`const g = t % 16;` through the `z` object). Changes, and only these:

- Rail rows use `kind: 'head' | 'thumb'` instead of the `isHead`/`isThumb` booleans.
- Return `stage: hasBible ? 'bible' : hasSong ? 'song' : 'text'` instead of the three `stageIs…` booleans.
- Return `live` and drop the fields derived from it (`field`, `labelInk`, `stageRing`, `liveWord`, `btn`, `key`, `btnBg`, `btnFg`, `addBg`); the renderer derives them.
- Add the types from the Interfaces block and annotate the return.

- [ ] **Step 4: Run, expect pass**

Run: `npm test` — Expected: all stanza tests pass.

- [ ] **Step 5: Renderer**

`src/stanza/StanzaJourney.tsx`: port artboard lines 190–284 (the `role="img"` element and its contents) using the same porting rules as Task 3 Step 6, plus:

```tsx
const [ref, beat] = useBeat()
const z = stanzaFrame(beat)
const live = z.live
const field = live ? '#1E1E1E' : '#DEDEDE'
const labelInk = live ? '#FAFAFA' : '#505050'
const stageRing = live ? '0.25cqw solid #f58549' : '0 solid transparent'
const btn = live ? { text: 'Stop', key: 'Esc', bg: '#2E2E2E', fg: '#FAFAFA' } : { text: 'Present', key: 'F5', bg: '#f58549', fg: '#2E2E2E' }
```

- `{{z.liveWord}}` → `{live ? 'LIVE' : ''}`; `{{z.addBg}}` → `#2E2E2E`.
- `<sc-for list="{{z.rows}}" as="r">` → `z.rows.map((r, i) => r.kind === 'head' ? <div key={i}>…head markup…</div> : <div key={i}>…thumb markup…</div>)`.
- `stageIsText` / `stageIsSong` / `stageIsBible` → `z.stage === 'text' | 'song' | 'bible'`.
- `ref` goes on the outer `role="img"` element; inner wrappers get `aria-hidden="true"`.
- Icon import: `../assets/stanza-icon.svg` (not used inside the screen any more; only in the text column from Task 2).

- [ ] **Step 6: Wire in**

In `src/projects.tsx`, Stanza stage: `<Laptop outline><StanzaJourney /></Laptop>`.

- [ ] **Step 7: Verify and commit**

Run: `npm run build && npm test` — Expected: pass.
Run: `npm run dev`. Watch two full loops: Add content → Song → search → Add song → rail shows the song with green verse pills → Add content → Bible reading → reference typed → preview → Add reading → verse on stage → verse 17 → Present → dark field, orange ring, Stop/Esc. Cursor lands on each control before it reacts.

```bash
git add -A && git commit -m "feat: Stanza add-song and add-reading journey animation"
```

---

### Task 5: About, contact form and email function

**Files:**
- Create: `netlify/functions/contact.ts`, `netlify/functions/contact.test.ts`, `src/ContactForm.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces:
  - `validate(body: unknown): { ok: true; name: string; email: string; message: string; spam: boolean } | { ok: false; error: string }`
  - default export `(req: Request) => Promise<Response>` at `/.netlify/functions/contact`.
  - `ContactForm()` component.

- [ ] **Step 1: Write the failing tests**

`netlify/functions/contact.test.ts`:

```ts
import { expect, test } from 'vitest'
import { validate } from './contact'

const good = { name: 'Sam Taylor', email: 'sam@example.org', message: 'We need a website.', company: '' }

test('accepts a complete message', () => {
  expect(validate(good)).toEqual({ ok: true, name: 'Sam Taylor', email: 'sam@example.org', message: 'We need a website.', spam: false })
})

test('flags the honeypot', () => {
  expect(validate({ ...good, company: 'Acme' })).toMatchObject({ ok: true, spam: true })
})

test.each([
  [{ ...good, name: '  ' }, 'Please enter your name.'],
  [{ ...good, email: 'nope' }, 'Please enter a valid email address.'],
  [{ ...good, message: '' }, 'Please enter a message.'],
  [{ ...good, name: 'a'.repeat(101) }, 'Name is too long.'],
  [{ ...good, message: 'a'.repeat(5001) }, 'Message is too long.'],
  [{ ...good, name: 'Sam\r\nBcc: x@y.z' }, 'Please enter your name.'],
  [{ ...good, email: 'sam@example.org\nBcc: x@y.z' }, 'Please enter a valid email address.'],
  [null, 'Invalid request.'],
  ['text', 'Invalid request.'],
])('rejects %j', (body, error) => {
  expect(validate(body)).toEqual({ ok: false, error })
})
```

- [ ] **Step 2: Run, expect failure**

Run: `npm test` — Expected: FAIL, cannot resolve `./contact`.

- [ ] **Step 3: Implement the function**

`netlify/functions/contact.ts`:

```ts
import nodemailer from 'nodemailer'

type Valid = { ok: true; name: string; email: string; message: string; spam: boolean }
type Invalid = { ok: false; error: string }

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function validate(body: unknown): Valid | Invalid {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' }
  const b = body as Record<string, unknown>
  const name = str(b.name), email = str(b.email), message = str(b.message)
  // CR/LF in a header field is a header-injection attempt, so treat it as invalid input
  if (!name || /[\r\n]/.test(name)) return { ok: false, error: 'Please enter your name.' }
  if (name.length > 100) return { ok: false, error: 'Name is too long.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { ok: false, error: 'Please enter a valid email address.' }
  if (!message) return { ok: false, error: 'Please enter a message.' }
  if (message.length > 5000) return { ok: false, error: 'Message is too long.' }
  return { ok: true, name, email, message, spam: str(b.company) !== '' }
}

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' })
  const v = validate(await req.json().catch(() => null))
  if (!v.ok) return json(400, v)
  if (v.spam) return json(200, { ok: true }) // honeypot filled: pretend success, send nothing

  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return json(500, { ok: false, error: 'Sending is not configured.' })
  try {
    await nodemailer
      .createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })
      .sendMail({
        from: `"Portfolio contact" <${user}>`,
        to: user,
        replyTo: { name: v.name, address: v.email },
        subject: `New project enquiry from ${v.name}`,
        text: `${v.message}\n\n— ${v.name} <${v.email}>`,
      })
    return json(200, { ok: true })
  } catch (err) {
    console.error('contact: send failed', err)
    return json(500, { ok: false, error: 'Could not send your message. Please try again.' })
  }
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test` — Expected: all contact tests pass.

- [ ] **Step 5: Form component**

`src/ContactForm.tsx`. Field and button styles are the artboard's (lines 384–398); labels verbatim ("Name", "Email", "What do you need?", "Send").

```tsx
import { useState, type FormEvent } from 'react'
import { st } from './st'

const FIELD = 'background: transparent; border: 0; border-bottom: 1px solid #9a9a9a; color: #ffffff; font: inherit; font-weight: 500; font-size: 20px; padding: 8px 0; border-radius: 0'

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending'); setError('')
    const body = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/.netlify/functions/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json().catch(() => ({}))
      if (res.ok) return setState('sent')
      setError(data.error || 'Could not send your message. Please try again.')
    } catch {
      setError('Could not send your message. Please check your connection and try again.')
    }
    setState('idle')
  }

  if (state === 'sent') return <p role="status" style={st('flex: 3 1 480px; margin: 0; font-size: 20px; font-weight: 500')}>Thank you — your message is on its way. I’ll reply by email.</p>

  return (
    <form onSubmit={submit} style={st('flex: 3 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 28px; max-width: 760px')}>
      <div style={st('display: flex; flex-wrap: wrap; gap: 28px 32px')}>
        <label style={st('flex: 1 1 220px; display: flex; flex-direction: column; gap: 4px')}>Name
          <input type="text" name="name" autoComplete="name" required maxLength={100} style={st('min-height: 48px; ' + FIELD)} />
        </label>
        <label style={st('flex: 1 1 220px; display: flex; flex-direction: column; gap: 4px')}>Email
          <input type="email" name="email" autoComplete="email" required style={st('min-height: 48px; ' + FIELD)} />
        </label>
      </div>
      <label style={st('display: flex; flex-direction: column; gap: 4px')}>What do you need?
        <textarea name="message" rows={4} required maxLength={5000} style={st(FIELD + '; resize: vertical')} />
      </label>
      {/* honeypot: hidden from people, tempting to bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={st('position: absolute; left: -9999px')} />
      {error && <p role="alert" style={st('margin: 0; color: #ffb4b4')}>{error}</p>}
      <button type="submit" disabled={state === 'sending'} style={st('align-self: flex-start; min-height: 52px; padding: 0 32px; background: #ffffff; color: #0a0a0a; border: 0; border-radius: 999px; font: inherit; font-weight: 600; font-size: 17px; cursor: pointer')}>
        {state === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
```

- [ ] **Step 6: About and contact sections in `App.tsx`**

After `</main>`, port artboard lines 362–372 (About) and 374–403 (Contact footer) with `st()`. In About, the portrait is `src/assets/gil.jpg` with `alt="Black and white portrait of Gil Virgo, smiling, outdoors"` and the statement text is exactly: `Husband. Father. Pastor. London. I love building software that is natural to use and beautiful to look at.` In Contact, replace the artboard's `<form>…</form>` with `<ContactForm />`.

- [ ] **Step 7: Verify and commit**

Run: `npm run build && npm test` — Expected: pass.
Run: `npx netlify dev` with a local `.env` holding `GMAIL_USER` and `GMAIL_APP_PASSWORD` (the user supplies these; do not commit the file). Submit the form: the thank-you line replaces the form and the email arrives with Reply-To set to the visitor. Submit with the network offline: the error line shows and typed input is kept.
If no credentials are available, verify instead that submitting returns the "Sending is not configured." error line, and say so in the task report.

```bash
git add -A && git commit -m "feat: about section, contact form and email function"
```

---

### Task 6: Final pass and deploy notes

**Files:**
- Create: `README.md`
- Modify: whatever the checks below turn up

- [ ] **Step 1: Responsive and accessibility pass**

Run `npm run dev` and check at 390, 768 and 1440:

- No horizontal page scroll (`document.documentElement.scrollWidth === innerWidth` in the console).
- Tab order: header links → each scrollable screen → project links → form fields → Send. Every focus is visible.
- One `h1`; six project `h2`s plus the contact `h2`.
- Both animations pause off screen and hold still under reduced motion.

Fix anything that fails.

- [ ] **Step 2: Safari check**

Open the dev URL in Safari. Leave the page with both animations on screen for 5 minutes. In Terminal: `footprint -p <pid of the com.apple.WebKit.WebContent process>` at the start and end; the "(graphics)" row should not climb steadily. If it does, look for any `transform` or `opacity` transition that slipped in and replace it.

- [ ] **Step 3: README**

`README.md`:

```markdown
# gilbertvirgo.co.uk

Vite + React + TypeScript. Hosted on Netlify.

    npm install
    npm run dev        # site only
    npx netlify dev    # site + contact function
    npm test
    npm run build

## Contact form

`netlify/functions/contact.ts` sends mail through Gmail SMTP. Set in Netlify
(Site settings → Environment variables):

- `GMAIL_USER` — the Gmail address that sends and receives enquiries
- `GMAIL_APP_PASSWORD` — a Google app password for that account

## Fonts

Sets Grotesk loads from Adobe Fonts kit `jnj6xdu`. The Adobe Fonts web
project must list `gilbertvirgo.co.uk` and the Netlify preview domain.

## Design source

`design/artboard/Main.dc.html` is the approved artboard. Device screens in
`src/assets/` are full-page captures of the live client sites.
```

- [ ] **Step 4: Verify and commit**

Run: `npm run build && npm test` — Expected: build succeeds, all tests pass.

```bash
git add -A && git commit -m "docs: README; final responsive and Safari pass"
```

Deploying (connecting the repo to Netlify, setting env vars, pointing the domain) is the user's step and is not part of this plan.

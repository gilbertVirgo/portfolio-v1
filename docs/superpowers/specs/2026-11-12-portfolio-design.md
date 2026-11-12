# Portfolio site for Gil Virgo — design spec

Date: 2026-11-12
Domain: gilbertvirgo.co.uk
Approved artboard: https://claude.ai/artifact/Vjhc5KkVn2bHdzTaF1gF2X (source copy in `design/artboard/Main.dc.html`)

## Purpose

Win freelance clients (churches, charities, small organisations). A visitor
scrolls through the work, then sends a message through the contact form.

## Stack

- Vite + React + TypeScript. Single page, no router.
- Netlify hosting. One Netlify Function for the contact form.
- No CSS framework. One global stylesheet plus inline layout where it is local.
- Fonts: Sets Grotesk through the Adobe Fonts kit
  `https://use.typekit.net/jnj6xdu.css` (family `sets-grotesk-l`, weights
  400/500/600). Fallback `Inter Tight`, then system sans. Inter (Google Fonts)
  for the Stanza mock only.

## Page structure

One long scroll, in this order. The artboard is the reference for layout,
colour, copy and spacing.

1. **Header** — "Gil Virgo", one-line descriptor, links: Work, About,
   Start a project. Not sticky. No hero.
2. **Projects** — six full-width sections, each with its own ground colour.
3. **About** — portrait and statement.
4. **Contact** — heading, form, small footer row.

### Project sections

Each section: a meta row (index `0N / 06`, disciplines, links) over a hairline,
a giant title, then a device stage.

| # | Project | Ground / text | Disciplines | Links | Stage |
|---|---------|---------------|-------------|-------|-------|
| 01 | Christian Heritage London | `#A8192E` / `#FFFFFF` | Visual identity, website and booking system | christianheritagelondon.org, bookings.christianheritagelondon.org | Laptop (site capture), tablet (booking animation), phone (site capture) |
| 02 | Life Church Richmond | `#0B2A2E` / `#FFFDF0` | Visual identity | none; right column reads "Logo, banners, signage" | Sideways-scrolling strip of six identity pieces with captions |
| 03 | Stanza | `#2F2D2E` / `#FAFAFA` | Desktop presentation app for churches | "Beta — v0.1.11" | Laptop (app animation), then icon, one-line pitch, download button |
| 04 | Selhurst Church | `#E5D87B` / `#231820` | Visual identity, website, photography and videography | selhurstchurch.org, "Full site in progress" | Laptop (design capture), logo tile |
| 05 | Victoria Park Community Church | `#F47A2B` / `#0B0A10` | Visual identity and website | vpcc.church | Laptop, phone (site captures) |
| 06 | Highbury Baptist Church | `#FFFCED` / `#1E1F1B` | Visual identity, website, photography and videography | highburybaptistchurch.org | Laptop, phone (site captures) |

Stanza download button links to
`https://github.com/gilbertVirgo/praise-pres-releases/releases/tag/v0.1.11`.

Projects are one typed data array; sections render from it in array order
(real DOM order, not CSS `order` as the artboard uses).

### Typography

- Giant titles and the contact heading: `clamp(48px, 11vw, 168px)`, weight
  600, line-height 0.88, letter-spacing −0.02em.
- About statement: `clamp(30px, 4.4vw, 68px)`, weight 600, line-height 1,
  letter-spacing −0.02em.
- Body and meta text: 15px, letter-spacing −0.01em.
- Title bottom margin scales `clamp(28px, 4.5vw, 64px)` so it is not loose on
  phones.

### Devices

Three frame components: `Laptop`, `Tablet`, `Phone`. Each is a dark bezel
around a screen with a fixed aspect ratio (16:10, 3:4, 9:19).

- **Site screens** are full-page captures (`design/assets/*.jpg`) placed in a
  vertically scrollable screen. This keeps each client's real typefaces
  without loading their Adobe kits. Images are lazy-loaded. Each scroll region
  is focusable and labelled.
- The Highbury captures contain a drawn stand-in for the Google Maps embed.
- The Selhurst capture is a render of the home page design, with two image
  fills un-flipped from the Figma export.
- **Animated screens** (CHL booking, Stanza) are HTML mocks, described below.

Stage layout is a wrapping flex row: laptop `flex: 4 1 420px`, tablet
`1.4 1 260px` (max 380px), phone `1 1 160px` (max 270px). At tablet width a
laptop and phone sit side by side; at phone width everything stacks.

### Animations

Both are looping, non-interactive walkthroughs with a moving cursor dot. Each
is a pure function from a beat number to a view state, rendered by a
component. One beat is 1.3 seconds. The cursor rests on a control one beat
before that control reacts.

**CHL booking (13 beats):** group size 1 → 2 → 3, Next; calendar, pick
Saturday 13, Next; details fill in name, email, phone, Next; review, choose
"Pay now by card", Confirm; Success. No prices are shown.

**Stanza (16 beats):** "+ Add content" → menu → Song → "Add a song" modal →
type "be thou" → Add song → rail gains a song block with verse pills;
"+ Add content" → Bible reading → "Add a Bible passage" modal → type
`john 3:16-17` → "Fetching verses…" → preview → Add reading → rail gains the
reading, stage shows the verse; select verse 17; Present → live state.
Song slides show bars rather than lyrics. Labels match the app.

Rules for both:

- Driven by one `setInterval` per component and CSS transitions on
  `left`/`top`/`background`. No infinite CSS `transform` or `opacity`
  keyframe animations (Safari compositing-layer leak).
- Paused while off screen (IntersectionObserver).
- With `prefers-reduced-motion: reduce`, no ticking: show the first beat.
- The mock is `role="img"` with a text description of the journey.

### About

Square black-and-white portrait (`design/assets/gil.jpg`) beside the
statement: "Husband. Father. Pastor. London. I love building software that is
natural to use and beautiful to look at."

### Contact

Black ground. Heading "Start a project". Fields: Name, Email, "What do you
need?" (textarea), Send button. Footer row: © Gil Virgo 2026,
gilbertvirgo.co.uk, GitHub link.

## Contact form backend

- `netlify/functions/contact.ts`, POST JSON `{ name, email, message, company }`.
- Sends one email with nodemailer over Gmail SMTP (`smtp.gmail.com:465`),
  from and to the same Gmail account, `replyTo` set to the visitor's email.
- Environment variables, set in Netlify only: `GMAIL_USER`,
  `GMAIL_APP_PASSWORD` (a Google app password, not the account password).
- Validation on the server: all three fields required, email shape checked,
  name ≤ 100 chars, message ≤ 5000 chars, header-injection characters
  rejected in name and email.
- Spam: `company` is a hidden honeypot field; if filled, return 200 and send
  nothing.
- Responses: 200 `{ ok: true }`, 400 with a field error, 405 for non-POST,
  500 if sending fails.
- Client states: idle, sending (button disabled), sent (form replaced by a
  short thank-you), error (message above the button, input kept).

## Accessibility and responsiveness

- Semantic landmarks; one `h1` (visually the header name), project titles `h2`.
- All text meets 4.5:1 on its ground (colours above already do).
- Form inputs have visible labels; touch targets at least 44px.
- No horizontal page scroll at 390px. Only the Life Church strip and device
  screens scroll within themselves.
- Works without JavaScript for reading; animations and form submit need it.

## Assets

Already in the repo under `design/assets/`: six site captures, the Selhurst
design capture and logo, CHL logo, Stanza icon, six Life Church pieces, the
portrait. The build moves them to `src/assets/`.

## Testing

- Vitest unit tests for the two beat functions (every beat returns a
  complete state; key beats show the expected screen) and for the contact
  function's validation and honeypot path with the mailer stubbed.
- Manual check at 390, 768 and 1440 widths, and in Safari.

## Out of scope

- Case-study pages, CMS, blog, analytics, dark mode.
- Client typefaces as live web fonts.
- Real screenshots of the Stanza app.

## Open points

- Life Church (dark teal) and Stanza (dark grey) are adjacent dark sections.
  Kept as approved; the colours are data and can change without layout work.
- The Adobe Fonts web project must allow `gilbertvirgo.co.uk` and the Netlify
  preview domain.

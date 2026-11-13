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

After a successful enquiry the function also sends the visitor a confirmation
email. Its template is `design/email/confirmation.mjml`; after editing it run
`npm run email` to regenerate `netlify/lib/confirmation-email.ts` and commit
the result. The function is served at `/api/contact` and rate-limited to 5
requests a minute per IP.

### Spam protection

- Cloudflare Turnstile. Set `VITE_TURNSTILE_SITE_KEY` (public, read at build
  time) and `TURNSTILE_SECRET_KEY` (server only) in Netlify. With the secret
  set, every submission must carry a token Cloudflare verifies; with neither
  set the widget and the check are both off (local development).
- A hidden honeypot field and the per-IP rate limit stay in place.

Only function files belong in `netlify/functions/` — Netlify deploys every
file there as a function. Tests and helpers live beside it in `netlify/`.

## Fonts

Sets Grotesk loads from Adobe Fonts kit `jnj6xdu`. The Adobe Fonts web
project must list `gilbertvirgo.co.uk` and the Netlify preview domain.

## Design source

`design/artboard/Main.dc.html` is the approved artboard. Device screens in
`src/assets/` are full-page captures of the live client sites.

`design/artboard/Motion-tiles.html` is the board for the video and motion
tiles; option A (sideways belt, no captions) is built. `Tablet-links.html` is
an option board, not yet approved. View both through the dev server.

The hero videos in `src/assets/*-hero.mp4` are the client sites' landing
videos re-encoded small (960 wide, 24fps, no audio):

    ffmpeg -i in.mp4 -an -vf "scale=960:-2,fps=24" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart out.mp4

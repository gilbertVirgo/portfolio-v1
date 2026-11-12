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

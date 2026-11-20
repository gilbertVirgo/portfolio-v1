import { useState } from 'react'
import { noOrphan } from './ProjectSection'
import { st } from './st'
import amtDesktop from './assets/amt-desktop.jpg'
import hcweDesktop from './assets/hcwe-desktop.jpg'
import hcweLogo from './assets/hcwe-logo.jpg'
import hcweMobile from './assets/hcwe-mobile.jpg'
import spucCandidates from './assets/spuc-candidates.jpg'
import spucHero from './assets/spuc-hero.jpg'
import spucRegions from './assets/spuc-regions.jpg'
import vpccDesktop from './assets/vpcc-desktop.jpg'
import vpccLogo from './assets/vpcc-art-logo.jpg'
import vpccWelcome from './assets/vpcc-art-welcome.jpg'
import vpccWelcomeCream from './assets/vpcc-art-welcome-cream.jpg'
import vpccWereHere from './assets/vpcc-art-were-here.jpg'
import vpccJoinUs from './assets/vpcc-art-join-us.jpg'
import vpccJoinUsBanner from './assets/vpcc-art-join-us-banner.jpg'
import vpccHotCrossBuns from './assets/vpcc-art-hot-cross-buns.jpg'
import vpccInvited from './assets/vpcc-art-youre-invited.jpg'
import vpccAllWelcome from './assets/vpcc-art-all-are-welcome.jpg'
import vpccEsol from './assets/vpcc-art-esol.jpg'

// Smaller projects, closed by default behind a native <details> toggle. Each shows one piece in a
// 16:10 frame; a tray of thumbnails under it swaps the others in. `page: true` = a web page capture,
// cropped from the top to fill the frame; artwork is shown whole on the project's ground colour.
// `note` stands in for the link where there is none to give (SPUC: work no longer on their site).
type Piece = { src: string; alt: string; page?: boolean }
const more: { title: string; disciplines: string; url?: string; note?: string; bg: string; pieces: Piece[] }[] = [
  {
    title: 'Victoria Park Community Church', disciplines: 'Visual identity, website and artwork', url: 'vpcc.church', bg: '#FCFCF5',
    pieces: [
      { src: vpccDesktop, page: true, alt: 'Victoria Park Community Church home page: cream ground, black and white photos, orange buttons, sections for Sundays, what’s on, about and beliefs' },
      { src: vpccLogo, alt: 'VPCC logo: lowercase vpcc in a solid orange circle' },
      { src: vpccWelcome, alt: 'Poster: WELCOME in heavy cream capitals on orange over a row of chevrons, “We meet here every Sunday, 3–4:30pm”' },
      { src: vpccWereHere, alt: 'Poster: a finger points at the church on a grey street map, WE’RE HERE in heavy speckled black type with a QR code and meeting details' },
      { src: vpccJoinUs, alt: 'Poster: JOIN US FOR CHURCH THIS SUNDAY in rounded block letters filled with a black and white photo of a smiling man' },
      { src: vpccJoinUsBanner, alt: 'Pull-up banner: JOIN US FOR CHURCH THIS SUNDAY in block letters filled with a photo of a smiling woman, with meeting details below' },
      { src: vpccHotCrossBuns, alt: 'Poster: HOT CROSS BUNS set along a white diagonal cross on orange, with date, time, address and a QR code' },
      { src: vpccInvited, alt: 'Invitation card: “you’re invited” repeated in cream italic rows on orange, one row in black' },
      { src: vpccAllWelcome, alt: 'Carol service flyer: ALL ARE WELCOME in decorative capitals on deep red, with a map to the Sports Cage by Victoria Park' },
      { src: vpccEsol, alt: 'Poster: free ESOL classes, learn English through stories old and new, Fridays 11–2pm' },
      { src: vpccWelcomeCream, alt: 'Poster: the WELCOME design reversed, orange capitals and chevrons on cream' },
    ],
  },
  {
    title: 'SPUC', disciplines: 'Website design and advertising', note: 'Scottish Parliament election, 2026', bg: '#2C2C2C',
    pieces: [
      { src: spucHero, alt: 'SPUC advert for the Scottish Parliament election: “Find your candidates and see where they stand” over candidates’ faces tagged with their votes' },
      { src: spucRegions, page: true, alt: 'SPUC website: explore parties by region, a map of Scotland with one region highlighted' },
      { src: spucCandidates, page: true, alt: 'SPUC website: select candidates to contact, a grid of candidate cards' },
    ],
  },
  {
    title: 'Hope Church West End', disciplines: 'Visual identity, website, photography', bg: '#232628',
    pieces: [
      { src: hcweDesktop, page: true, alt: 'Hope Church West End home page: dark starry hero reading Hope for London, Hope for You over photos of a Tube platform and a black cab, then Sundays, About us, Our team, Get in touch and Find us' },
      { src: hcweMobile, alt: 'Hope Church West End home page on a phone: Hope for London, Hope for You over a photo of Oxford Circus Tube station, then Sundays' },
      { src: hcweLogo, alt: 'Hope Church West End logo: HOPE in rounded yellow blocks stacked two by two, the O lit like a crescent moon, on charcoal' },
    ],
  },
  {
    title: 'Automated Medical Technologies', disciplines: 'Website', url: 'automatedmedtech.com', bg: '#0F172A',
    pieces: [{ src: amtDesktop, page: true, alt: 'Automated Medical Technologies home page: dark navy hero reading Precision Medicine Powered by Intelligence, then the company, its core technology and the INJEXA injection system' }],
  },
]

function Entry({ m }: { m: (typeof more)[number] }) {
  const [i, setI] = useState(0)
  const p = m.pieces[i]
  return (
    <article style={st('min-width: 0')}>
      <div className="frame" style={st(`background: ${m.bg}`)}>
        <img src={p.src} alt={p.alt} className={p.page ? 'page-shot' : undefined} />
      </div>
      {m.pieces.length > 1 && (
        <div className="tray" role="group" aria-label={`${m.title}: pieces`}>
          {m.pieces.map((q, n) => (
            <button key={q.src} type="button" aria-pressed={n === i} aria-label={`Show piece ${n + 1} of ${m.pieces.length}`} onClick={() => setI(n)} style={st(`background: ${m.bg}`)}>
              <img src={q.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <h3 style={st('margin: 20px 0 8px; font-size: clamp(26px, 3cqw, 44px); font-weight: 600; line-height: 1; letter-spacing: -0.02em')}>{noOrphan(m.title)}</h3>
      <p style={st('margin: 0')}>{m.disciplines}</p>
      {m.url && <a target="_blank" rel="noopener" href={`https://${m.url}`} style={st('display: inline-block; padding: 6px 0')}>{m.url}</a>}
      {m.note && <p style={st('margin: 0; padding: 6px 0; opacity: 0.6')}>{m.note}</p>}
    </article>
  )
}

export function MoreWork() {
  return (
    <section id="more" className="more" style={st('padding: 0 clamp(16px, 2.5cqw, 36px)')}>
      <details>
        <summary style={st('display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid #0a0a0a; cursor: pointer')}>
          <h2 style={st('margin: 0; font: inherit')}>More work ({more.length})</h2>
        </summary>
        <div style={st('display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: 48px clamp(24px, 3.5cqw, 48px); padding: 40px 0 112px')}>
          {more.map((m) => <Entry key={m.title} m={m} />)}
        </div>
      </details>
    </section>
  )
}

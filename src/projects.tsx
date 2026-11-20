import type { ReactNode } from 'react'
import { ABoard, Capture, Flyer, Laptop, Phone, Roller, Tablet } from './devices'
import { HbcButtons, HeroTile, WordReveal } from './tiles'
import { st } from './st'
import { BookingJourney } from './booking/BookingJourney'
import { StanzaJourney } from './stanza/StanzaJourney'
import chlDesktop from './assets/chl-desktop.webp'
import chlMobile from './assets/chl-mobile.webp'
import chlArtPoster from './assets/chl-art-remember-poster.webp'
import chlArtHistory from './assets/chl-art-history-isnt-finished.webp'
import chlArtGod from './assets/chl-art-god-of-god.webp'
import chlArtSummer from './assets/chl-art-summer-school.webp'
import chlArtMap from './assets/chl-art-map.webp'
import lcrPlaque from './assets/lcr-plaque.webp'
import lcrWelcome from './assets/lcr-welcome.webp'
import lcrRoller1 from './assets/lcr-roller1.webp'
import lcrRoller2 from './assets/lcr-roller2.webp'
import lcrPrayer from './assets/lcr-prayer.webp'
import lcrLogos from './assets/lcr-logos.webp'
import vpccDesktop from './assets/vpcc-desktop.webp'
import vpccLogo from './assets/vpcc-art-logo.webp'
import vpccWelcome from './assets/vpcc-art-welcome.webp'
import vpccWelcomeCream from './assets/vpcc-art-welcome-cream.webp'
import vpccWereHere from './assets/vpcc-art-were-here.webp'
import vpccJoinUs from './assets/vpcc-art-join-us.webp'
import vpccJoinUsBanner from './assets/vpcc-art-join-us-banner.webp'
import vpccHcb from './assets/vpcc-art-hot-cross-buns.webp'
import vpccHcbWhite from './assets/vpcc-art-hot-cross-buns-white.webp'
import vpccInvited from './assets/vpcc-art-youre-invited.webp'
import vpccEsol from './assets/vpcc-art-esol.webp'
import stanzaIcon from './assets/stanza-icon.svg'
import scHome from './assets/sc-home.webp'
import selhurstLogo from './assets/selhurst-logo-dark.svg'
import hbcDesktop from './assets/hbc-desktop.webp'
import hbcMobile from './assets/hbc-mobile.webp'
import chlHero from './assets/chl-hero.mp4'
import chlHeroPoster from './assets/chl-hero.webp'
import selhurstHero from './assets/selhurst-hero.mp4'
import selhurstHeroPoster from './assets/selhurst-hero.webp'
import hbcHero from './assets/hbc-hero.mp4'
import hbcHeroPoster from './assets/hbc-hero.webp'

export type Project = { id: string; title: string; bg: string; fg: string; disciplines: string; links: ReactNode; stage: ReactNode; bleed?: boolean }

const laptop = (src: string, alt: string, bg: string) => (
  <Laptop><Capture src={src} alt={alt} ratio="16 / 10" bg={bg} radius="4px" /></Laptop>
)
const phone = (src: string, alt: string, bg: string) => (
  <Phone><Capture src={src} alt={alt} ratio="9 / 19" bg={bg} radius="26px" /></Phone>
)

// A project's stage as a sideways scroller: mockups first, then the video and motion tiles, the next
// one peeking in at the right edge. Sizes and the phone layout are in styles.css ("Belt and tiles").
// The .pin around it holds it mid-screen while the page scrolls it sideways (scrollIntent.ts).
const belt = (label: string, children: ReactNode) => (
  <div className="pin">
    <div className="belt" tabIndex={0} role="region" aria-label={label}>{children}</div>
  </div>
)

// Christian Heritage London print and social pieces, packed into one bento tile (styles.css, "Bento").
// The poster leads and runs the full height; the rest fill the grid in order and are cropped to fit.
const chlArt: { src: string; alt: string; caption: string }[] = [
  { src: chlArtPoster, alt: 'Pale blue poster: a line drawing of a man’s face under the word Remember in red capitals, with Hebrews 13:7 below', caption: 'Remember poster, A5' },
  { src: chlArtHistory, alt: 'Podcast cover: History isn’t Finished in pink serif capitals over two older men in glasses, printed in navy halftone on cream', caption: 'History isn’t Finished podcast cover' },
  { src: chlArtGod, alt: 'Podcast cover: God of God, Light of Light in heavy cream capitals on a dark grainy blue ground', caption: 'God of God podcast cover' },
  { src: chlArtSummer, alt: 'Event banner: Summer School in tall condensed capitals under a yellow-to-blue grainy gradient, with the speakers’ names and 5–9 August 2024', caption: 'Summer School banner, 16:9' },
  { src: chlArtMap, alt: 'Walking map of the City of London in blue, with numbered stops and a key of the Christians linked to each', caption: 'City walking map, A4' },
]

export const projects: Project[] = [
  {
    id: 'chl', title: 'Christian Heritage London', bg: '#A8192E', fg: '#ffffff',
    disciplines: 'Visual identity, website, booking system and artwork',
    links: (
      <>
        <a target="_blank" rel="noopener" href="https://christianheritagelondon.org">christianheritagelondon.org</a>
        <a target="_blank" rel="noopener" href="https://bookings.christianheritagelondon.org">bookings.christianheritagelondon.org</a>
      </>
    ),
    bleed: true,
    stage: belt('Christian Heritage London website, booking system, landing video and artwork, scrolls sideways', (
      <>
        <Tablet><BookingJourney /></Tablet>
        <HeroTile site="chl" video={chlHero} poster={chlHeroPoster} label="Christian Heritage London landing video, a street scene in the City, under the headline Explore London’s Stories">
          <h3>Explore<br />London’s Stories</h3>
          <p>Discover London’s Christian heroes, whose faith changed the world, through guided walking tours.</p>
          <span className="chl-button">Book a London walk</span>
        </HeroTile>
        {laptop(chlDesktop, 'Christian Heritage London home page: dark hero reading Explore London’s Stories, then walks, podcast, articles and gift vouchers', '#ffffff')}
        <div className="bento" role="group" aria-label="Christian Heritage London artwork: poster, podcast covers, event banner and walking map">
          {chlArt.map((a) => <div key={a.caption}><img src={a.src} alt={a.alt} loading="lazy" /></div>)}
        </div>
        {phone(chlMobile, 'Christian Heritage London home page at phone width', '#ffffff')}
      </>
    )),
  },
  {
    id: 'vpcc', title: 'Victoria Park Community Church', bg: '#FCFCF5', fg: '#0a0a0a',
    disciplines: 'Visual identity, website and artwork',
    links: <a target="_blank" rel="noopener" href="https://vpcc.church">vpcc.church</a>,
    bleed: true,
    stage: belt('Victoria Park Community Church website, street signs, flyers and posters, scrolls sideways', (
      <>
        {laptop(vpccDesktop, 'Victoria Park Community Church home page: cream ground, black and white photos, orange buttons, sections for Sundays, what’s on, about and beliefs', '#FCFCF5')}
        <ABoard front={vpccWelcome} back={vpccWelcomeCream} label="A-board, turning: WELCOME in heavy cream capitals on orange over a row of chevrons on one side, the same reversed in orange on cream on the other, “We meet here every Sunday, 3–4:30pm”" />
        <Roller src={vpccJoinUsBanner} alt="Roller banner: JOIN US FOR CHURCH THIS SUNDAY in block letters filled with a photo of a smiling woman, with meeting details below" />
        <Flyer front={vpccJoinUs} back={vpccWereHere} label="Flyer, turning over. Front: JOIN US FOR CHURCH THIS SUNDAY in rounded block letters filled with a black and white photo of a smiling man. Back: a finger points at the church on a street map, WE’RE HERE, with a QR code and meeting details" />
        <Flyer lag={2000} front={vpccHcbWhite} back={vpccHcb} label="Flyer, turning over: HOT CROSS BUNS set along a diagonal orange cross on white, and on the back the same in a white cross on orange, with date, time, address and a QR code" />
        <img className="print flat" src={vpccEsol} alt="Poster: free ESOL classes, learn English through stories old and new, Fridays 11–2pm" loading="lazy" style={st('height: 34em')} />
        <img className="print flat" src={vpccInvited} alt="Invitation card: “you’re invited” repeated in cream italic rows on orange, one row in black" loading="lazy" style={st('height: 24em')} />
        <img className="logo-tile" src={vpccLogo} alt="VPCC logo: lowercase vpcc in a solid orange circle" loading="lazy" style={st('aspect-ratio: 1; border-radius: 8px')} />
      </>
    )),
  },
  {
    id: 'stanza', title: 'Stanza', bg: '#2f2d2e', fg: '#FAFAFA',
    disciplines: 'Desktop presentation app for churches', links: <span>Beta — v0.1.11</span>,
    stage: (
      <>
        <Laptop outline><StanzaJourney /></Laptop>
        <div style={st('flex: 1 1 260px; max-width: 380px; display: flex; flex-direction: column; gap: 24px; align-items: flex-start')}>
          <img src={stanzaIcon} alt="Stanza app icon" style={st('width: 72px; height: 72px')} />
          <p style={st('margin: 0; font-size: clamp(22px, 2.2cqw, 32px); font-weight: 500; line-height: 1.1; letter-spacing: -0.015em')}>Presentation software for churches. Replaces PowerPoint on a Sunday.</p>
          <a target="_blank" rel="noopener" href="https://github.com/gilbertVirgo/praise-pres-releases/releases/tag/v0.1.11" style={st('display: inline-flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 24px; background: #f58549; color: #2E2E2E; font-weight: 600; font-size: 17px; text-decoration: none; border-radius: 999px')}>
            Download beta release
            <svg aria-hidden="true" viewBox="0 0 24 24" style={st('width: 18px; height: 18px')} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v14M6 12l6 6 6-6" /></svg>
          </a>
        </div>
      </>
    ),
  },
  {
    id: 'selhurst', title: 'Selhurst Church', bg: '#E5D87B', fg: '#231820',
    disciplines: 'Visual identity, website, photography and videography',
    links: (
      <>
        <a target="_blank" rel="noopener" href="https://selhurstchurch.org">selhurstchurch.org</a>
        <span>Full site in progress</span>
      </>
    ),
    bleed: true,
    stage: belt('Selhurst Church home page design, landing video and logo, scrolls sideways', (
      <>
        <HeroTile site="selhurst" video={selhurstHero} poster={selhurstHeroPoster} label="Selhurst Church landing video of people at church, under the headline Welcome to Selhurst Church, which builds in word by word">
          <WordReveal text="Welcome to Selhurst Church" />
          <p>We’re glad you’re here.</p>
          <div className="row"><span className="selhurst-button">Find us</span><span className="selhurst-button light">Get in touch</span></div>
        </HeroTile>
        {laptop(scHome, 'Selhurst Church home page: welcome hero, photos in soft blob shapes, a yellow Join us this Sunday band with map, what’s on, latest talk and a dark footer', '#FFFEF2')}
        <div className="tile spec selhurst" aria-hidden="true"><WordReveal text="Welcome to Selhurst Church" /></div>
        <img className="logo-tile" src={selhurstLogo} alt="Selhurst Church logo: a cream cross over a gold letter S on dark aubergine" style={st('aspect-ratio: 1; border-radius: 8px')} />
      </>
    )),
  },
  {
    id: 'lcr', title: 'Life Church Richmond', bg: '#0B2A2E', fg: '#FFFDF0',
    disciplines: 'Visual identity', links: <span>Logo, banners, signage</span>, bleed: true,
    stage: belt('Life Church Richmond signage, banners and logo, scrolls sideways', (
      <>
        <img className="print flat" src={lcrPlaque} alt="Life Church Richmond door plaque: the word life set on a diagonal in magenta, beside the church name" loading="lazy" style={st('height: 26em')} />
        <ABoard front={lcrWelcome} back={lcrPrayer} label="A-board, turning: one side a cream poster reading everyone is welcome in large spaced magenta letters, with Sunday times; the other the Lord’s Prayer in serif type with a large magenta initial" />
        <Roller src={lcrRoller1} alt="Magenta roller banner: everyone is welcome in spaced yellow letters" />
        <Roller src={lcrRoller2} alt="Yellow roller banner: everyone is welcome in spaced magenta letters" />
        <img className="print flat" src={lcrLogos} alt="Logo variations in dark teal, magenta, blue, yellow and cream, on light and dark grounds" loading="lazy" style={st('height: 40em; background: #E6E2D3; padding: 2.4em')} />
      </>
    )),
  },
  {
    id: 'hbc', title: 'Highbury Baptist Church', bg: '#FFFCED', fg: '#1E1F1B',
    disciplines: 'Visual identity, website, photography and videography',
    links: <a target="_blank" rel="noopener" href="https://highburybaptistchurch.org">highburybaptistchurch.org</a>,
    bleed: true,
    stage: belt('Highbury Baptist Church website, landing video and buttons, scrolls sideways', (
      <>
        <HeroTile site="hbc" video={hbcHero} poster={hbcHeroPoster} label="Highbury Baptist Church landing video of a Sunday service, under the headline Come as you are and two buttons that fill with colour on hover">
          <h3>Come as you are</h3>
          <p>You’re welcome here — whether you’ve been coming to church for years, or you’re just curious.</p>
          <HbcButtons />
        </HeroTile>
        {phone(hbcMobile, 'Highbury Baptist Church home page at phone width', '#FFFCED')}
        {laptop(hbcDesktop, 'Highbury Baptist Church home page: hero reading Come as you are in heavy cream type over a photo, then who we are, Sundays and what to expect', '#FFFCED')}
        <div className="tile spec hbc" aria-hidden="true"><HbcButtons demo /></div>
      </>
    )),
  },
]

import type { ReactNode } from 'react'
import { Capture, Laptop, Phone, Tablet } from './devices'
import { HbcButtons, HeroTile, WordReveal } from './tiles'
import { st } from './st'
import { BookingJourney } from './booking/BookingJourney'
import { StanzaJourney } from './stanza/StanzaJourney'
import chlDesktop from './assets/chl-desktop.jpg'
import chlMobile from './assets/chl-mobile.jpg'
import lcrPlaque from './assets/lcr-plaque.png'
import lcrWelcome from './assets/lcr-welcome.png'
import lcrRoller1 from './assets/lcr-roller1.png'
import lcrRoller2 from './assets/lcr-roller2.png'
import lcrPrayer from './assets/lcr-prayer.png'
import lcrLogos from './assets/lcr-logos.png'
import stanzaIcon from './assets/stanza-icon.svg'
import scHome from './assets/sc-home.jpg'
import selhurstLogo from './assets/selhurst-logo-dark.svg'
import hbcDesktop from './assets/hbc-desktop.jpg'
import hbcMobile from './assets/hbc-mobile.jpg'
import chlHero from './assets/chl-hero.mp4'
import chlHeroPoster from './assets/chl-hero.jpg'
import selhurstHero from './assets/selhurst-hero.mp4'
import selhurstHeroPoster from './assets/selhurst-hero.jpg'
import hbcHero from './assets/hbc-hero.mp4'
import hbcHeroPoster from './assets/hbc-hero.jpg'

export type Project = { id: string; title: string; bg: string; fg: string; disciplines: string; links: ReactNode; stage: ReactNode; bleed?: boolean }

const laptop = (src: string, alt: string, bg: string) => (
  <Laptop><Capture src={src} alt={alt} ratio="16 / 10" bg={bg} radius="4px" /></Laptop>
)
const phone = (src: string, alt: string, bg: string) => (
  <Phone><Capture src={src} alt={alt} ratio="9 / 19" bg={bg} radius="26px" /></Phone>
)

// A project's stage as a sideways scroller: mockups first, then the video and motion tiles, the next
// one peeking in at the right edge. Sizes and the phone layout are in styles.css ("Belt and tiles").
const belt = (label: string, children: ReactNode) => (
  <div className="belt" tabIndex={0} role="region" aria-label={label}>{children}</div>
)

// min-content: the figure is only as wide as its image, so a long caption wraps instead of stretching the image
const figureStyle = 'margin: 0; flex: none; width: min-content; display: flex; flex-direction: column; gap: 12px'
const tall = 'height: clamp(340px, 42cqw, 600px); width: auto; display: block'
const lcrFigures: { src: string; alt: string; caption: string; style: string }[] = [
  { src: lcrPlaque, alt: 'Life Church Richmond logo: the word life set on a diagonal in magenta, beside the church name', caption: 'Door plaque, A4', style: 'height: clamp(240px, 30cqw, 420px); width: auto; display: block' },
  { src: lcrWelcome, alt: 'Cream poster reading everyone is welcome in large spaced magenta letters', caption: 'Welcome banner, A2', style: tall },
  { src: lcrRoller1, alt: 'Tall magenta roller banner with yellow lettering', caption: 'Roller banner 1, 800 × 2000 mm', style: tall },
  { src: lcrRoller2, alt: 'Tall yellow roller banner with magenta lettering', caption: 'Roller banner 2, 800 × 2000 mm', style: tall },
  { src: lcrPrayer, alt: 'Cream poster of the Lord’s Prayer in serif type with a large magenta initial', caption: 'Lord’s Prayer banner, A2', style: tall },
  { src: lcrLogos, alt: 'Logo variations in dark teal, magenta, blue, yellow and cream, on light and dark grounds', caption: 'Logo, all variations', style: tall + '; background: #E6E2D3; padding: 24px' },
]

export const projects: Project[] = [
  {
    id: 'chl', title: 'Christian Heritage London', bg: '#A8192E', fg: '#ffffff',
    disciplines: 'Visual identity, website and booking system',
    links: (
      <>
        <a target="_blank" rel="noopener" href="https://christianheritagelondon.org">christianheritagelondon.org</a>
        <a target="_blank" rel="noopener" href="https://bookings.christianheritagelondon.org">bookings.christianheritagelondon.org</a>
      </>
    ),
    bleed: true,
    stage: belt('Christian Heritage London website, booking system and landing video, scrolls sideways', (
      <>
        <Tablet><BookingJourney /></Tablet>
        <HeroTile site="chl" video={chlHero} poster={chlHeroPoster} label="Christian Heritage London landing video, a street scene in the City, under the headline Explore London’s Stories">
          <h3>Explore<br />London’s Stories</h3>
          <p>Discover London’s Christian heroes, whose faith changed the world, through guided walking tours.</p>
          <span className="chl-button">Book a London walk</span>
        </HeroTile>
        {laptop(chlDesktop, 'Christian Heritage London home page: dark hero reading Explore London’s Stories, then walks, podcast, articles and gift vouchers', '#ffffff')}
        {phone(chlMobile, 'Christian Heritage London home page at phone width', '#ffffff')}
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
    stage: belt('Life Church Richmond identity pieces, scrolls sideways', lcrFigures.map((f) => (
      <figure key={f.caption} style={st(figureStyle)}>
        <img src={f.src} alt={f.alt} loading="lazy" style={st(f.style)} />
        <figcaption>{f.caption}</figcaption>
      </figure>
    ))),
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

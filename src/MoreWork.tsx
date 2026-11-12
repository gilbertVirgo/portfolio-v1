import { Capture } from './devices'
import { st } from './st'
import amtDesktop from './assets/amt-desktop.jpg'
import hcweDesktop from './assets/hcwe-desktop.jpg'
import vpccDesktop from './assets/vpcc-desktop.jpg'

// Smaller projects, closed by default behind a native <details> toggle:
// one scrollable capture each, no device mockups, no giant headline.
const more = [
  {
    title: 'Victoria Park Community Church', disciplines: 'Visual identity and website', url: 'vpcc.church',
    src: vpccDesktop, bg: '#FCFCF5',
    alt: 'Victoria Park Community Church home page: cream ground, black and white photos, orange buttons, sections for Sundays, what’s on, about and beliefs',
  },
  {
    title: 'Hope Church West End', disciplines: 'Visual identity, website, photography', url: '',
    src: hcweDesktop, bg: '#FAF6ED',
    alt: 'Hope Church West End home page: dark starry hero reading Hope for London, Hope for You over photos of a Tube platform and a black cab, then Sundays, About us, Our team, Get in touch and Find us',
  },
  {
    title: 'Automated Medical Technologies', disciplines: 'Website', url: 'automatedmedtech.com',
    src: amtDesktop, bg: '#ffffff',
    alt: 'Automated Medical Technologies home page: dark navy hero reading Precision Medicine Powered by Intelligence, then the company, its core technology and the INJEXA injection system',
  },
]

export function MoreWork() {
  return (
    <section id="more" className="more" style={st('padding: 0 clamp(16px, 2.5cqw, 36px)')}>
      <details>
        <summary style={st('display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid #0a0a0a; cursor: pointer')}>
          <h2 style={st('margin: 0; font: inherit')}>More work ({more.length})</h2>
        </summary>
        <div style={st('display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: 48px clamp(24px, 3.5cqw, 48px); padding: 40px 0 112px')}>
          {more.map((m) => (
            <article key={m.title} style={st('min-width: 0')}>
              <div style={st('border: 1px solid #0a0a0a')}>
                <Capture src={m.src} alt={m.alt} label={`${m.title} website, scrollable`} ratio="16 / 10" bg={m.bg} radius="0" />
              </div>
              <h3 style={st('margin: 20px 0 8px; font-size: clamp(26px, 3cqw, 44px); font-weight: 600; line-height: 1; letter-spacing: -0.02em')}>{m.title}</h3>
              <p style={st('margin: 0')}>{m.disciplines}</p>
              {m.url && <a href={`https://${m.url}`} style={st('display: inline-block; padding: 6px 0')}>{m.url}</a>}
            </article>
          ))}
        </div>
      </details>
    </section>
  )
}

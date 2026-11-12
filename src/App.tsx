import { useEffect, useRef } from 'react'
import { ContactForm } from './ContactForm'
import gil from './assets/gil.jpg'
import { MoreWork } from './MoreWork'
import { ProjectSection } from './ProjectSection'
import { projects } from './projects'
import { st } from './st'

export default function App() {
  const header = useRef<HTMLElement>(null)
  // Header slides away on scroll down and back in on scroll up. Class toggle only: no re-render.
  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const el = header.current
      if (!el || scrollY === last) return
      el.classList.toggle('away', scrollY > last && scrollY > el.offsetHeight)
      last = scrollY
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="page" id="top">
      <header ref={header} className="site-header" style={st('display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: space-between; align-items: baseline; padding: 20px clamp(16px, 2.5cqw, 36px)')}>
        <h1 style={st('margin: 0; font-size: inherit; font-weight: 600; flex: 1 1 160px')}>Gil Virgo</h1>
        <p style={st('margin: 0; flex: 2 1 280px')}>Identity, websites and software for churches and charities.</p>
        <nav style={st('display: flex; gap: 24px; flex: 1 1 200px; justify-content: flex-end')}>
          <a href="#work" style={st('text-decoration: none; padding: 12px 0')}>Work</a>
          <a href="#about" style={st('text-decoration: none; padding: 12px 0')}>About</a>
          <a href="#contact" style={st('padding: 12px 0')}>Start a project</a>
        </nav>
      </header>
      {/* Phone width only: the description leaves the sticky bar and sits in the page (see styles.css) */}
      <p className="tagline" style={st('display: none; margin: 0; padding: 16px clamp(16px, 2.5cqw, 36px) 20px')}>Identity, websites and software for churches and charities.</p>
      <main id="work">
        {projects.map((p, i) => <ProjectSection key={p.id} p={p} index={i} total={projects.length} />)}
        <MoreWork />
      </main>
      <section id="about" style={st('padding: 0 clamp(16px, 2.5cqw, 36px) 112px')}>
        <div style={st('display: flex; flex-wrap: wrap; gap: 8px 32px; padding: 20px 0; border-bottom: 1px solid #0a0a0a')}>
          <h2 style={st('flex: 1 1 160px; margin: 0; font: inherit')}>About Gil Virgo</h2>
          <span style={st('flex: 3 1 480px')}></span>
        </div>
        <div style={st('display: flex; flex-wrap: wrap; gap: 32px clamp(32px, 5cqw, 72px); padding-top: 40px; align-items: flex-end')}>
          <img src={gil} alt="Black and white portrait of Gil Virgo, smiling, outdoors" style={st('flex: 1 1 220px; max-width: 380px; min-width: 0; aspect-ratio: 1; object-fit: cover; display: block')} />
          <p style={st('flex: 3 1 480px; min-width: 0; margin: 0; font-size: clamp(30px, 4.4cqw, 68px); font-weight: 600; line-height: 1; letter-spacing: -0.02em; max-width: 16em')}>Husband. Father. Pastor. I love building stuff that's simple, smooth and intuitive. Based in London, UK.</p>
        </div>
      </section>
      <footer id="contact" style={st('background: #0a0a0a; color: #ffffff; padding: 0 clamp(16px, 2.5cqw, 36px) 32px')}>
        <div style={st('display: flex; flex-wrap: wrap; gap: 8px 32px; padding: 20px 0; border-bottom: 1px solid #ffffff')}>
          <span style={st('flex: 1 1 160px')}>Contact</span>
          <span style={st('flex: 3 1 480px')}>Have a church, charity or product that needs an identity, a website or a tool? Tell me about it.</span>
        </div>
        <h2 style={st('margin: clamp(24px, 3cqw, 40px) 0 clamp(28px, 4.5cqw, 64px); font-size: clamp(48px, 11cqw, 168px); font-weight: 600; line-height: 0.88; letter-spacing: -0.02em')}>Start a project</h2>
        <div style={st('display: flex; flex-wrap: wrap; gap: 32px')}>
          <span style={st('flex: 1 1 160px')}></span>
          <ContactForm />
        </div>
        <div style={st('display: flex; flex-wrap: wrap; gap: 8px 32px; justify-content: space-between; margin-top: 112px; padding-top: 20px; border-top: 1px solid #ffffff')}>
          <span style={st('flex: 1 1 160px')}>© Gil Virgo 2026</span>
          <span style={st('flex: 2 1 280px')}>gilbertvirgo.co.uk</span>
          <span style={st('flex: 1 1 200px; text-align: right')}><a href="https://github.com/gilbertVirgo" style={st('display: inline-block; padding: 12px 0')}>GitHub</a></span>
        </div>
      </footer>
    </div>
  )
}

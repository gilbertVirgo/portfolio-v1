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

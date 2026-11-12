import { useBeat } from '../useBeat'
import { st } from '../st'
import { bookingFrame } from './frame'
import logo from '../assets/chl-logo.svg'

const F = "font-family: Figtree, 'Inter Tight', sans-serif"
const G = "font-family: 'EB Garamond', Georgia, serif"
const h1 = st(`${F}; font-weight: 600; font-size: 8cqw; line-height: 1`)
const label = (margin: string, extra = '') => st(`${F}; font-weight: 700; font-size: 2.4cqw; letter-spacing: 0.12em; ${extra}margin: ${margin}`)
const field = st(`border: 0.3cqw solid #282828; height: 11cqw; padding: 0 3cqw; display: flex; align-items: center; ${G}; font-size: 4.4cqw`)

export function BookingJourney() {
  const [ref, beat] = useBeat()
  const b = bookingFrame(beat)
  return (
    <div ref={ref} role="img" aria-label="Animated walkthrough of the booking system: choose group size, pick a walk on the calendar, enter details, review, success" style={st('position: relative; aspect-ratio: 3 / 4; overflow: hidden; container-type: inline-size; background: #ffffff; color: #282828; border-radius: 12px; letter-spacing: 0; display: flex; flex-direction: column')}>
      <div aria-hidden="true" style={st('display: flex; justify-content: space-between; align-items: center; padding: 3cqw 5cqw; border-bottom: 0.3cqw solid #e6e6e6')}>
        <img src={logo} alt="" style={st('height: 8cqw')} />
        <div style={st('display: flex; gap: 1cqw')}>
          <span style={st('width: 5cqw; height: 0.8cqw; background: #A8192E')} />
          <span style={st(`width: 5cqw; height: 0.8cqw; background: ${b.steps[0]}`)} />
          <span style={st(`width: 5cqw; height: 0.8cqw; background: ${b.steps[1]}`)} />
          <span style={st(`width: 5cqw; height: 0.8cqw; background: ${b.steps[2]}`)} />
        </div>
      </div>
      <div aria-hidden="true" style={st('padding: 7cqw 6cqw; flex: 1; min-height: 0')}>
        {b.screen === 'size' && (
          <>
            <div style={h1}>Book a tour</div>
            <div style={label('7cqw 0 2.4cqw')}>GROUP SIZE</div>
            <div style={st(`display: flex; width: 44cqw; border: 0.3cqw solid #8a8a8a; ${F}; font-size: 5cqw`)}>
              <span style={st('width: 12cqw; height: 12cqw; border-right: 0.3cqw solid #8a8a8a; display: flex; align-items: center; justify-content: center')}>−</span>
              <span style={st('flex: 1; display: flex; align-items: center; justify-content: center')}>{b.size}</span>
              <span style={st('width: 12cqw; height: 12cqw; border-left: 0.3cqw solid #8a8a8a; display: flex; align-items: center; justify-content: center')}>+</span>
            </div>
            <div style={st('display: flex; gap: 3cqw; border: 0.3cqw solid #e0e0e0; padding: 4cqw; margin-top: 7cqw')}>
              <span style={st('width: 4cqw; height: 4cqw; border: 0.3cqw solid #8a8a8a; flex: none; margin-top: 0.6cqw')} />
              <span>
                <span style={st(`display: block; ${F}; font-weight: 500; font-size: 3.8cqw`)}>Make it a private tour</span>
                <span style={st(`display: block; ${G}; font-size: 3.2cqw; line-height: 1.35; color: #5c5c5c; margin-top: 1cqw`)}>We keep our tours open to everyone by default, so private tours are limited.</span>
              </span>
            </div>
            <div style={label('7cqw 0 0', 'color: #A8192E; ')}>I HAVE A VOUCHER CODE</div>
          </>
        )}
        {b.screen === 'calendar' && (
          <>
            <div style={h1}>Choose your walk</div>
            <div style={st(`display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 1.2cqw; margin-top: 6cqw; ${F}; font-weight: 600; font-size: 3cqw`)}>
              {b.days.map((d) => (
                <span key={d.n} style={st(`aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6cqw; border: 0.3cqw solid #e0e0e0; background: ${d.bg}; color: ${d.fg}`)}>
                  {d.n}
                  <span style={st(`width: 1.2cqw; height: 1.2cqw; border-radius: 50%; background: ${d.dot}`)} />
                </span>
              ))}
            </div>
            {b.picked && (
              <div style={st('display: flex; justify-content: space-between; align-items: center; border: 0.3cqw solid #282828; padding: 3.4cqw 4cqw; margin-top: 5cqw')}>
                <span>
                  <span style={st(`display: block; ${F}; font-weight: 600; font-size: 4.2cqw`)}>City Walk</span>
                  <span style={st(`display: block; ${G}; font-size: 3.4cqw; color: #5c5c5c`)}>Saturday 13 · 3 guests</span>
                </span>
                <span style={st(`${F}; font-weight: 700; font-size: 2.4cqw; letter-spacing: 0.12em; color: #A8192E`)}>ADDED</span>
              </div>
            )}
          </>
        )}
        {b.screen === 'details' && (
          <>
            <div style={h1}>Your details</div>
            <div style={label('7cqw 0 2cqw')}>NAME</div>
            <div style={field}>{b.name}</div>
            <div style={label('5cqw 0 2cqw')}>EMAIL</div>
            <div style={field}>{b.email}</div>
            <div style={label('5cqw 0 2cqw')}>PHONE</div>
            <div style={field}>{b.phone}</div>
          </>
        )}
        {b.screen === 'review' && (
          <>
            <div style={h1}>Review</div>
            <div style={st('display: flex; border: 0.3cqw solid #282828; margin-top: 6cqw')}>
              <span style={st('width: 20cqw; padding: 4cqw 0; background: #f3f1ec; border-right: 0.3cqw dashed #8a8a8a; display: flex; flex-direction: column; align-items: center; gap: 0.6cqw')}>
                <span style={st(`${F}; font-weight: 700; font-size: 2.4cqw; letter-spacing: 0.12em`)}>SAT</span>
                <span style={st(`${F}; font-weight: 600; font-size: 9cqw; line-height: 1`)}>13</span>
              </span>
              <span style={st('flex: 1; padding: 4cqw')}>
                <span style={st(`display: block; ${F}; font-weight: 600; font-size: 5cqw`)}>City Walk</span>
                <span style={st(`display: block; ${G}; font-size: 3.6cqw; color: #5c5c5c`)}>3 guests</span>
              </span>
            </div>
            <div style={label('7cqw 0 2.4cqw')}>PAYMENT</div>
            <div style={st(`border: 0.3cqw solid #8a8a8a; padding: 3.4cqw 4cqw; ${F}; font-weight: 600; font-size: 4cqw`)}>Pay on the day</div>
            <div style={st(`border: ${b.payBorder}; padding: 3.4cqw 4cqw; margin-top: 2cqw; ${F}; font-weight: 600; font-size: 4cqw; display: flex; justify-content: space-between`)}>
              Pay now by card<span style={st('color: #A8192E')}>{b.payMark}</span>
            </div>
          </>
        )}
        {b.screen === 'done' && (
          <div style={st('padding-top: 22cqw; text-align: center')}>
            <svg aria-hidden="true" viewBox="0 0 20 20" style={st('width: 16cqw; height: 16cqw')} fill="none" stroke="#A8192E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8.5" /><path d="M5.5 10.5l3 3 6-7" /></svg>
            <div style={st(`${F}; font-weight: 600; font-size: 8cqw; line-height: 1; margin-top: 5cqw`)}>Success</div>
            <div style={st(`${G}; font-size: 4cqw; color: #5c5c5c; margin-top: 3cqw`)}>Thank you — your booking is confirmed.</div>
          </div>
        )}
      </div>
      <div aria-hidden="true" style={st('padding: 3cqw 6cqw; border-top: 0.3cqw solid #e6e6e6; background: #ffffff')}>
        <div style={st(`background: #A8192E; color: #ffffff; text-align: center; padding: 4cqw; ${F}; font-weight: 700; font-size: 2.8cqw; letter-spacing: 0.14em`)}>{b.btn}</div>
      </div>
      <span aria-hidden="true" style={st(`position: absolute; left: ${b.cx}; top: ${b.cy}; width: 7cqw; height: 7cqw; margin: -3.5cqw 0 0 -3.5cqw; border-radius: 50%; background: #28282833; border: 0.4cqw solid #282828; transition: left 0.6s ease, top 0.6s ease; pointer-events: none`)} />
    </div>
  )
}

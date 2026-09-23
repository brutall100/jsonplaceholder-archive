// Living background: a swaying desk-lamp glow, dust motes rising through the light
// and paper things (envelopes, stamps, postmarks) drifting slowly past.
import { paperShapes } from './icons.js'

const between = (min, max) => min + Math.random() * (max - min)

export function initBackground() {
  const layer = document.querySelector('.bg')
  if (!layer) return

  layer.innerHTML = '<div class="bg__glow bg__glow--ink"></div><div class="bg__glow bg__glow--lamp"></div>'

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const isSmall = matchMedia('(max-width: 640px)').matches
  const moteCount = isSmall ? 16 : 32
  const drifterCount = isSmall ? 3 : 6
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < moteCount; i++) {
    const mote = document.createElement('span')
    mote.className = 'mote'
    const duration = between(14, 30)
    mote.style.cssText = [
      `--x:${between(0, 100).toFixed(1)}%`,
      `--size:${between(2, 5).toFixed(1)}px`,
      `--dur:${duration.toFixed(1)}s`,
      `--delay:${(-between(0, duration)).toFixed(1)}s`,
      `--drift:${between(-60, 60).toFixed(0)}px`,
      `--o:${between(0.35, 0.9).toFixed(2)}`
    ].join(';')
    fragment.append(mote)
  }

  for (let i = 0; i < drifterCount; i++) {
    const drifter = document.createElement('div')
    drifter.className = 'drifter'
    const duration = between(55, 95)
    const rotation = between(-25, 25)
    drifter.style.cssText = [
      `--y:${between(8, 85).toFixed(0)}vh`,
      `--w:${between(34, 70).toFixed(0)}px`,
      `--dur:${duration.toFixed(0)}s`,
      `--delay:${(-between(0, duration)).toFixed(0)}s`,
      `--dy:${between(-12, 12).toFixed(0)}vh`,
      `--rot:${rotation.toFixed(0)}deg`,
      `--spin:${(rotation + between(-90, 90)).toFixed(0)}deg`
    ].join(';')
    drifter.innerHTML = paperShapes[i % paperShapes.length]
    fragment.append(drifter)
  }

  layer.append(fragment)
}

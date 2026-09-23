// Generated artwork: initials avatars and vintage "postcard" photos.
// JSONPlaceholder photo links point to a service that no longer exists,
// so every photo is drawn as a small SVG landscape from the palette instead.
import { el } from './dom.js'

function palette() {
  const styles = getComputedStyle(document.documentElement)
  const read = name => styles.getPropertyValue(name).trim()
  return {
    navy: read('--navy'),
    sand: read('--sand'),
    cocoa: read('--cocoa'),
    paper: read('--paper'),
    ink: read('--ink')
  }
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Small seeded random generator, so photo #7 always looks the same.
function random(seed) {
  let value = seed * 9301 + 49297
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function initials(name) {
  return name
    .replace(/^(Mrs?|Ms|Dr)\.\s+/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

export function avatar(user, size = 48) {
  const colors = palette()
  const schemes = [
    [colors.navy, colors.paper],
    [colors.sand, colors.ink],
    [colors.cocoa, colors.paper],
    [colors.ink, colors.sand]
  ]
  const [background, foreground] = schemes[user.id % schemes.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${background}"/>
    <circle cx="64" cy="0" r="26" fill="${foreground}" opacity=".12"/>
    <text x="32" y="41" text-anchor="middle" font-family="Georgia, serif" font-size="25" font-weight="700" fill="${foreground}">${initials(user.name)}</text>
  </svg>`

  return el('img', {
    class: 'avatar',
    src: toDataUri(svg),
    alt: '',
    width: size,
    height: size
  })
}

function hills(rand, baseY, amplitude, color, opacity) {
  const points = []
  const steps = 6
  for (let i = 0; i <= steps; i++) {
    points.push([(600 / steps) * i, baseY - rand() * amplitude])
  }
  let path = `M0 450 L0 ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1]
    const [x, y] = points[i]
    const midX = (px + x) / 2
    path += ` C${midX} ${py} ${midX} ${y} ${x} ${y}`
  }
  path += ' L600 450 Z'
  return `<path d="${path}" fill="${color}" opacity="${opacity}"/>`
}

export function postcardUri(id) {
  const colors = palette()
  const rand = random(id)
  const skies = [
    [colors.sand, colors.paper],
    [colors.navy, colors.sand],
    [colors.paper, colors.sand],
    [colors.cocoa, colors.sand],
    [colors.navy, colors.paper]
  ]
  const [skyTop, skyBottom] = skies[Math.floor(rand() * skies.length)]
  const sunX = 80 + rand() * 440
  const sunY = 90 + rand() * 120
  const sunR = 28 + rand() * 40
  const birds = Array.from({ length: Math.floor(rand() * 4) }, () => {
    const x = 60 + rand() * 480
    const y = 50 + rand() * 90
    return `<path d="M${x} ${y} q8 -8 16 0 q8 -8 16 0" fill="none" stroke="${colors.ink}" stroke-width="3" opacity=".55"/>`
  }).join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
    <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBottom}"/>
    </linearGradient></defs>
    <rect width="600" height="450" fill="url(#s)"/>
    <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${colors.paper}" opacity=".85"/>
    ${birds}
    ${hills(rand, 300, 90, colors.navy, 0.55)}
    ${hills(rand, 350, 70, colors.cocoa, 0.75)}
    ${hills(rand, 410, 40, colors.ink, 0.85)}
    <rect x="12" y="12" width="576" height="426" fill="none" stroke="${colors.paper}" stroke-width="10" opacity=".9"/>
  </svg>`

  return toDataUri(svg)
}

export function postcard(id, { width = 600, height = 450, alt = '', lazy = true } = {}) {
  return el('img', {
    class: 'postcard',
    src: postcardUri(id),
    alt,
    width,
    height,
    loading: lazy ? 'lazy' : undefined,
    decoding: 'async'
  })
}

// Inline SVG icons (stroke = currentColor, so they follow the theme).
const svg = (body, viewBox = '0 0 24 24') =>
  `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`

export const icons = {
  cabinet: svg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 12h16M10 7.5h4M10 16.5h4"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  stamp: svg('<path d="M9 3h6v4.5a2 2 0 0 0 1 1.7l1.5.8A2 2 0 0 1 18.5 12v2h-13v-2a2 2 0 0 1 1-1.7l1.5-.8A2 2 0 0 0 9 7.5z"/><path d="M4 18h16M6 21h12"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  back: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  retry: svg('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
  more: svg('<path d="M12 5v14M5 12h14"/>')
}

// Silhouettes for the drifting background.
export const paperShapes = [
  // envelope
  '<svg viewBox="0 0 64 44"><rect x="2" y="2" width="60" height="40" rx="3" fill="currentColor"/><path d="M2 4l30 22L62 4" fill="none" stroke="var(--bg)" stroke-width="3"/></svg>',
  // postage stamp with perforated edge
  '<svg viewBox="0 0 48 56"><path fill="currentColor" d="M4 0h4a4 4 0 0 0 8 0h8a4 4 0 0 0 8 0h8a4 4 0 0 0 8 0v4a4 4 0 0 0 0 8v8a4 4 0 0 0 0 8v8a4 4 0 0 0 0 8v8a4 4 0 0 0 0 8h-4a4 4 0 0 0-8 0h-8a4 4 0 0 0-8 0h-8a4 4 0 0 0-8 0H0v-4a4 4 0 0 0 0-8v-8a4 4 0 0 0 0-8v-8a4 4 0 0 0 0-8v-8a4 4 0 0 0 0-8V0z"/><circle cx="24" cy="26" r="9" fill="var(--bg)" opacity=".5"/></svg>',
  // round postmark
  '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="3"/><path d="M0 26h64M0 38h64" stroke="currentColor" stroke-width="3"/></svg>',
  // index card
  '<svg viewBox="0 0 64 42"><rect x="0" y="6" width="64" height="36" rx="3" fill="currentColor"/><rect x="6" y="0" width="20" height="10" rx="3" fill="currentColor"/><path d="M8 20h48M8 28h48M8 36h30" stroke="var(--bg)" stroke-width="2" opacity=".6"/></svg>',
  // paper clip
  '<svg viewBox="0 0 24 60"><path d="M18 18v26a7 7 0 0 1-14 0V12a5 5 0 0 1 10 0v30a2 2 0 0 1-4 0V18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
]

import { el } from '../dom.js'
import { count } from '../api.js'
import { postcard } from '../art.js'
import { icons } from '../icons.js'
import { initLayout, iconButton, showError } from '../layout.js'
import { countUp, reveal } from '../effects.js'

initLayout()

const drawers = [
  { key: 'users', label: 'Users', href: 'users.html', tab: 'A' },
  { key: 'posts', label: 'Posts', href: 'posts.html', tab: 'B' },
  { key: 'albums', label: 'Albums', href: 'albums.html', tab: 'C' },
  { key: 'comments', label: 'Comments', href: 'search.html?type=comments', tab: 'D' },
  { key: 'photos', label: 'Photos', href: 'search.html?type=photos', tab: 'E' }
]

function renderHero() {
  document.querySelector('#hero-actions').append(
    iconButton(icons.stamp, 'Browse posts', { href: 'posts.html' }),
    iconButton(icons.search, 'Search', { href: 'search.html', class: 'btn btn--ghost' })
  )
  document.querySelector('#hero-art').append(postcard(3, { lazy: false }), postcard(11, { lazy: false }), postcard(24, { lazy: false }))
}

async function renderDrawers() {
  const content = document.querySelector('#content')
  const items = drawers.map(drawer => {
    const number = el('span', { class: 'drawer__count', text: '0' })
    const item = el(
      'li',
      { class: 'card card--lift' },
      el('span', { class: 'card__tab', text: `Drawer ${drawer.tab}` }),
      el(
        'a',
        { class: 'drawer', href: drawer.href },
        number,
        el('span', { class: 'drawer__label', text: drawer.label }),
        el('span', { class: 'drawer__handle' })
      )
    )
    return { drawer, number, item }
  })

  content.append(el('ul', { class: 'drawers' }, items.map(({ item }) => item)))
  reveal(items.map(({ item }) => item))

  try {
    const totals = await Promise.all(drawers.map(drawer => count(drawer.key)))
    items.forEach(({ number }, index) => countUp(number, totals[index]))
  } catch (error) {
    showError(content, error)
  }
}

renderHero()
renderDrawers()

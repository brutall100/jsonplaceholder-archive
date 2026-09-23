// Shared page chrome: header with folder-tab navigation, search, theme toggle, footer.
import { el } from './dom.js'
import { icons } from './icons.js'
import { initBackground } from './background.js'
import { initButtons } from './effects.js'

const REPO_URL = 'https://github.com/brutall100/jsonplaceholder-archive'

const tabs = [
  { key: 'home', label: 'Home', href: './' },
  { key: 'users', label: 'Users', href: 'users.html' },
  { key: 'posts', label: 'Posts', href: 'posts.html' },
  { key: 'albums', label: 'Albums', href: 'albums.html' }
]

// Detail pages light up their parent tab.
const parentTab = { user: 'users', post: 'posts', album: 'albums' }

function html(markup) {
  const template = document.createElement('template')
  template.innerHTML = markup
  return template.content
}

function currentTheme() {
  const saved = document.documentElement.getAttribute('data-theme')
  if (saved) return saved
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function createThemeToggle() {
  const button = el('button', { class: 'theme-toggle', type: 'button' })
  button.append(html(icons.moon), html(icons.sun))
  button.firstElementChild.classList.add('icon-moon')
  button.lastElementChild.classList.add('icon-sun')

  const update = () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    button.setAttribute('aria-label', `Switch to ${next} theme`)
    button.title = `Switch to ${next} theme`
  }

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch (error) {
      // Not saved, but the switch still works for this visit.
    }
    update()
  })

  update()
  return button
}

function createHeader(page) {
  const active = parentTab[page] ?? page

  const brand = el('a', { class: 'brand', href: './' })
  brand.append(html(icons.cabinet), el('span', {}, 'The Archive', el('small', { text: 'JSONPlaceholder' })))

  const searchInput = el('input', {
    type: 'search',
    id: 'header-search',
    name: 'q',
    placeholder: 'Search the archive…',
    autocomplete: 'off'
  })
  const searchButton = el('button', { class: 'btn', type: 'submit', 'aria-label': 'Search' })
  searchButton.append(html(icons.search))

  const search = el(
    'form',
    { class: 'header-search', action: 'search.html', method: 'get', role: 'search' },
    el('label', { class: 'sr-only', for: 'header-search', text: 'Search the archive' }),
    searchInput,
    searchButton
  )

  const nav = el(
    'nav',
    { 'aria-label': 'Main' },
    el(
      'ul',
      { class: 'tabs' },
      tabs.map(tab =>
        el('li', {}, el('a', { href: tab.href, text: tab.label, 'aria-current': tab.key === active ? 'page' : undefined }))
      )
    )
  )

  return el('div', { class: 'wrap' }, el('div', { class: 'site-header__top' }, brand, search, createThemeToggle()), nav)
}

function createFooter() {
  const year = new Date().getFullYear()
  return el(
    'div',
    { class: 'wrap' },
    el('p', {}, 'Data from ', el('a', { href: 'https://jsonplaceholder.typicode.com', text: 'JSONPlaceholder' }), ' — a free fake REST API.'),
    el('p', {}, `© ${year} brutall100 · `, el('a', { href: REPO_URL, text: 'Source code' }), ' · MIT')
  )
}

export function initLayout() {
  const page = document.body.dataset.page
  document.querySelector('#site-header')?.append(createHeader(page))
  document.querySelector('#site-footer')?.append(createFooter())
  initBackground()
  initButtons()
}

// ---------- Loading / error states ----------

export function showLoading(container, count = 6, className = 'grid') {
  container.setAttribute('aria-busy', 'true')
  container.replaceChildren(
    el('ul', { class: className, 'aria-hidden': 'true' }, Array.from({ length: count }, () => el('li', { class: 'card skeleton' })))
  )
}

export function doneLoading(container, ...children) {
  container.setAttribute('aria-busy', 'false')
  container.replaceChildren(...children)
}

export function showError(container, error) {
  const notFound = error?.message === 'not-found'
  const retry = el('button', { class: 'btn', type: 'button', onclick: () => location.reload() })
  retry.append(html(icons.retry), 'Try again')

  doneLoading(
    container,
    el(
      'div',
      { class: 'card notice', role: 'alert' },
      el('h2', { text: notFound ? 'Not in the archive' : 'The archive is closed' }),
      el('p', {
        text: notFound
          ? 'We looked in every drawer, but this record does not exist.'
          : 'We could not reach JSONPlaceholder. Check your connection and try again.'
      }),
      notFound ? el('a', { class: 'btn', href: './', text: 'Back to home' }) : retry
    )
  )
  console.warn('Archive request failed:', error)
}

export function iconButton(icon, label, props = {}) {
  const tag = props.href ? 'a' : 'button'
  const button = el(tag, { class: 'btn', type: tag === 'button' ? 'button' : undefined, ...props })
  const iconNode = html(icon).firstElementChild
  iconNode.classList.add('btn__icon')
  button.append(iconNode, label)
  return button
}

export { html }

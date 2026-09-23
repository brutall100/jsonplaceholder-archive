import { el, getParam, highlight, capitalize } from '../dom.js'
import { search } from '../api.js'
import { avatar, postcard } from '../art.js'
import { icons } from '../icons.js'
import { initLayout, showLoading, doneLoading, showError, iconButton } from '../layout.js'
import { countUp, reveal } from '../effects.js'

initLayout()

const LIMIT = 10

const categories = {
  posts: {
    label: 'Posts',
    render: (post, query) => [
      el('h3', {}, el('a', { href: `post.html?id=${post.id}` }, highlight(post.title, query))),
      el('p', {}, highlight(post.body.replace(/\s+/g, ' '), query))
    ]
  },
  users: {
    label: 'Users',
    render: (user, query) => [
      el(
        'h3',
        { class: 'author' },
        avatar(user, 32),
        el('a', { href: `user.html?id=${user.id}` }, highlight(user.name, query))
      ),
      el('p', {}, highlight(`@${user.username} · ${user.email} · ${user.company.name}`, query))
    ]
  },
  comments: {
    label: 'Comments',
    render: (comment, query) => [
      el('h3', {}, el('a', { href: `post.html?id=${comment.postId}#comment-${comment.id}` }, highlight(comment.name, query))),
      el('p', {}, highlight(`${comment.body.replace(/\s+/g, ' ')} — ${comment.email}`, query))
    ]
  },
  albums: {
    label: 'Albums',
    render: (album, query) => [
      el('h3', {}, el('a', { href: `album.html?id=${album.id}` }, highlight(capitalize(album.title), query))),
      el('p', { text: `Album ${album.id}` })
    ]
  },
  photos: {
    label: 'Photos',
    render: (photo, query) => [
      el(
        'h3',
        { class: 'author' },
        postcard(photo.id, { width: 64, height: 48, alt: '' }),
        el('a', { href: `album.html?id=${photo.albumId}` }, highlight(capitalize(photo.title), query))
      ),
      el('p', { text: `In album ${photo.albumId}` })
    ]
  }
}

function buildForm(onSearch) {
  const input = el('input', { type: 'search', id: 'q', name: 'q', required: true, placeholder: 'e.g. dolor, Bret, sunt…' })
  const select = el(
    'select',
    { id: 'type', name: 'type' },
    el('option', { value: 'all', text: 'Everything' }),
    Object.entries(categories).map(([value, { label }]) => el('option', { value, text: label }))
  )

  const form = el(
    'form',
    { class: 'card', role: 'search', action: 'search.html', method: 'get' },
    el('div', { class: 'field' }, el('label', { for: 'q', text: 'Search for' }), input),
    el('div', { class: 'field' }, el('label', { for: 'type', text: 'In' }), select),
    iconButton(icons.search, 'Search', { type: 'submit' })
  )

  form.addEventListener('submit', event => {
    event.preventDefault()
    onSearch(input.value.trim(), select.value)
  })

  return { form, input, select }
}

function resultSection(type, items, total, query) {
  const { label, render } = categories[type]
  const cards = items.map(item => el('li', { class: 'card' }, render(item, query)))
  const more = total > items.length ? ` (showing first ${items.length})` : ''

  return {
    cards,
    section: el(
      'section',
      { 'aria-label': label },
      el('h2', { class: 'section-title', text: `${label} · ${total}${more}` }),
      el('ol', { class: 'stack result-list' }, cards)
    )
  }
}

async function runSearch(results, query, type) {
  const params = new URLSearchParams({ q: query })
  if (type !== 'all') params.set('type', type)
  history.replaceState(null, '', `?${params}`)
  document.title = `“${query}” · Search · JSONPlaceholder Archive`

  showLoading(results, 3, 'stack')

  try {
    const types = type === 'all' ? Object.keys(categories) : [type]
    const responses = await Promise.all(types.map(name => search(name, query, LIMIT)))
    const found = types
      .map((name, index) => ({ name, ...responses[index] }))
      .filter(({ data }) => data.length > 0)
    const total = found.reduce((sum, { total }) => sum + total, 0)

    if (total === 0) {
      doneLoading(
        results,
        el(
          'div',
          { class: 'card notice' },
          el('h2', { text: 'No results found' }),
          el('p', {}, 'No records match ', el('strong', { text: `“${query}”` }), '. Try a shorter word or another category.')
        )
      )
      return
    }

    const counter = el('strong', { text: '0' })
    const sections = found.map(({ name, data, total }) => resultSection(name, data, total, query))
    doneLoading(
      results,
      el('p', { class: 'results-summary' }, counter, ` records match “${query}”.`),
      ...sections.map(({ section }) => section)
    )
    countUp(counter, total, 800)
    reveal(sections.flatMap(({ cards }) => cards))
  } catch (error) {
    showError(results, error)
  }
}

function init() {
  const content = document.querySelector('#content')
  const results = el('div', { class: 'search-results' })
  const { form, input, select } = buildForm((query, type) => query && runSearch(results, query, type))

  content.append(el('div', { class: 'search-panel' }, form), results)

  const query = (getParam('q') ?? '').trim()
  const type = getParam('type')
  if (type && type in categories) select.value = type

  if (query) {
    input.value = query
    runSearch(results, query, select.value)
  } else {
    results.append(el('p', { class: 'results-summary', text: 'Type a word and press Search. Results appear here without reloading the page.' }))
    input.focus()
  }
}

init()

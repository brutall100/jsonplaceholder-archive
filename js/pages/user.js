import { el, getParam, plural } from '../dom.js'
import { getAlbumsByUser, getPostsByUser, getUser } from '../api.js'
import { avatar, postcard } from '../art.js'
import { initLayout, showLoading, doneLoading, showError } from '../layout.js'
import { reveal } from '../effects.js'

initLayout()

function detail(label, ...value) {
  return el('div', {}, el('dt', { text: label }), el('dd', {}, ...value))
}

function dossier(user) {
  const { address, company } = user
  const mapUrl = `https://www.google.com/maps?q=${address.geo.lat},${address.geo.lng}`
  const website = user.website.startsWith('http') ? user.website : `https://${user.website}`

  return el(
    'section',
    { class: 'card dossier', 'aria-label': 'Contact details' },
    el('span', { class: 'card__tab', text: `File ${String(user.id).padStart(3, '0')}` }),
    avatar(user, 112),
    el('h2', { text: user.name }),
    el('p', { class: 'person__handle', text: `@${user.username}` }),
    el(
      'dl',
      { class: 'details' },
      detail('Email', el('a', { href: `mailto:${user.email}`, text: user.email })),
      detail('Phone', el('a', { href: `tel:${user.phone.replace(/[^\d+x]/g, '')}`, text: user.phone })),
      detail('Website', el('a', { href: website, text: user.website, target: '_blank', rel: 'noopener' })),
      detail(
        'Address',
        el(
          'a',
          { href: mapUrl, target: '_blank', rel: 'noopener', title: 'Open in Google Maps' },
          el('address', { style: 'font-style:normal', text: `${address.street}, ${address.suite}, ${address.city} ${address.zipcode}` })
        )
      ),
      detail('Company', el('strong', { text: company.name }), el('br'), `“${company.catchPhrase}”`)
    )
  )
}

function postsSection(user, posts) {
  return el(
    'section',
    { class: 'card', 'aria-labelledby': 'user-posts' },
    el('span', { class: 'card__tab', text: plural(posts.length, 'letter') }),
    el('h2', { id: 'user-posts', text: `Posts by ${user.name}` }),
    el(
      'ol',
      { class: 'link-list' },
      posts.map(post => el('li', {}, el('a', { href: `post.html?id=${post.id}`, text: post.title })))
    )
  )
}

function albumsSection(user, albums) {
  const cards = albums.map(album =>
    el(
      'li',
      {},
      el(
        'a',
        { href: `album.html?id=${album.id}` },
        postcard((album.id - 1) * 50 + 1, { width: 300, height: 225, alt: '' }),
        el('span', { class: 'gallery__caption', text: album.title })
      )
    )
  )

  return el(
    'section',
    { 'aria-labelledby': 'user-albums' },
    el('h2', { class: 'section-title', id: 'user-albums', text: `Albums by ${user.name}` }),
    albums.length ? el('ul', { class: 'gallery' }, cards) : el('p', { text: 'No albums yet.' })
  )
}

async function init() {
  const content = document.querySelector('#content')
  const id = getParam('id')
  showLoading(content, 2)

  try {
    if (!id) throw new Error('not-found')
    const [user, posts, albums] = await Promise.all([getUser(id), getPostsByUser(id), getAlbumsByUser(id)])
    if (!user.id) throw new Error('not-found')

    document.querySelector('#page-title').textContent = user.name
    document.title = `${user.name} · JSONPlaceholder Archive`

    const profile = el('div', { class: 'profile' }, dossier(user), postsSection(user, posts))
    const albumBlock = albumsSection(user, albums)
    doneLoading(content, profile, albumBlock)
    reveal([...profile.children, albumBlock])
  } catch (error) {
    showError(content, error)
  }
}

init()

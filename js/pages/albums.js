import { el, plural } from '../dom.js'
import { getAlbumCover, getAlbums, getUsers } from '../api.js'
import { postcard } from '../art.js'
import { icons } from '../icons.js'
import { initLayout, showLoading, doneLoading, showError, iconButton } from '../layout.js'
import { reveal } from '../effects.js'

initLayout()

const PAGE_SIZE = 12

function albumCard(album, user, cover, isFirst) {
  const image = postcard(cover.photo?.id ?? album.id, { width: 600, height: 450, lazy: !isFirst, alt: '' })

  return el(
    'li',
    { class: 'card card--lift album-card' },
    el('span', { class: 'card__tab', text: `Album ${String(album.id).padStart(3, '0')}` }),
    el('a', { class: 'album-card__cover', href: `album.html?id=${album.id}`, 'aria-label': `Open album “${album.title}”` }, image),
    el('h2', {}, el('a', { href: `album.html?id=${album.id}`, text: album.title })),
    el(
      'p',
      { class: 'card__meta' },
      el('span', {}, 'by ', el('a', { href: `user.html?id=${user.id}`, text: user.name })),
      el('span', { class: 'stamp', text: plural(cover.total, 'photo') })
    )
  )
}

async function init() {
  const content = document.querySelector('#content')
  showLoading(content, 6)

  try {
    const [albums, users] = await Promise.all([getAlbums(), getUsers()])
    const usersById = new Map(users.map(user => [user.id, user]))
    const list = el('ol', { class: 'grid' })
    const moreWrap = el('div', { class: 'load-more' })
    let shown = 0

    const showMore = async () => {
      const batch = albums.slice(shown, shown + PAGE_SIZE)
      moreButton.disabled = true
      const covers = await Promise.all(batch.map(album => getAlbumCover(album.id)))
      const cards = batch.map((album, index) =>
        albumCard(album, usersById.get(album.userId), covers[index], shown === 0 && index === 0)
      )
      list.append(...cards)
      reveal(cards)
      shown += cards.length
      moreButton.disabled = false
      if (shown >= albums.length) moreWrap.remove()
      else moreButton.lastChild.textContent = `Show more (${albums.length - shown} left)`
    }

    const moreButton = iconButton(icons.more, 'Show more', { onclick: () => showMore().catch(error => showError(content, error)) })
    moreWrap.append(moreButton)

    await showMore()
    doneLoading(content, list, ...(shown < albums.length ? [moreWrap] : []))
  } catch (error) {
    showError(content, error)
  }
}

init()

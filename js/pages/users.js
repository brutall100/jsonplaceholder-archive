import { el, plural } from '../dom.js'
import { getAlbums, getPosts, getUsers } from '../api.js'
import { avatar } from '../art.js'
import { initLayout, showLoading, doneLoading, showError } from '../layout.js'
import { reveal } from '../effects.js'

initLayout()

function countBy(items, key) {
  return items.reduce((totals, item) => {
    totals[item[key]] = (totals[item[key]] ?? 0) + 1
    return totals
  }, {})
}

function userCard(user, postCount, albumCount) {
  return el(
    'li',
    { class: 'card card--lift' },
    el('span', { class: 'card__tab', text: `File ${String(user.id).padStart(3, '0')}` }),
    el(
      'div',
      { class: 'person' },
      avatar(user, 56),
      el(
        'div',
        {},
        el('h2', {}, el('a', { href: `user.html?id=${user.id}`, text: user.name })),
        el('p', { class: 'person__handle', text: `@${user.username} · ${user.company.name}` })
      ),
      el(
        'p',
        { class: 'card__meta' },
        el('a', { class: 'stamp', href: `posts.html?user=${user.id}` }, el('strong', { text: postCount }), postCount === 1 ? 'post' : 'posts'),
        el('span', { text: plural(albumCount, 'album') }),
        el('span', { text: user.address.city })
      )
    )
  )
}

async function init() {
  const content = document.querySelector('#content')
  showLoading(content, 6)

  try {
    const [users, posts, albums] = await Promise.all([getUsers(), getPosts(), getAlbums()])
    const postCounts = countBy(posts, 'userId')
    const albumCounts = countBy(albums, 'userId')
    const cards = users.map(user => userCard(user, postCounts[user.id] ?? 0, albumCounts[user.id] ?? 0))

    doneLoading(content, el('ul', { class: 'grid' }, cards))
    reveal(cards)
  } catch (error) {
    showError(content, error)
  }
}

init()

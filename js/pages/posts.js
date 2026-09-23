import { el, getParam } from '../dom.js'
import { getComments, getPosts, getUsers } from '../api.js'
import { avatar } from '../art.js'
import { icons } from '../icons.js'
import { initLayout, showLoading, doneLoading, showError, iconButton } from '../layout.js'
import { reveal } from '../effects.js'

initLayout()

const PAGE_SIZE = 12

function excerpt(text, length = 110) {
  const flat = text.replace(/\s+/g, ' ')
  return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat
}

function postCard(post, user, commentCount) {
  return el(
    'li',
    { class: 'card card--lift' },
    el('span', { class: 'card__tab', text: `No. ${String(post.id).padStart(3, '0')}` }),
    el('h2', {}, el('a', { href: `post.html?id=${post.id}`, text: post.title })),
    el('p', { class: 'card__excerpt', text: excerpt(post.body) }),
    el(
      'p',
      { class: 'card__meta' },
      el('span', { class: 'author' }, avatar(user, 28), el('a', { href: `user.html?id=${user.id}`, text: user.name })),
      el('span', { class: 'stamp' }, el('strong', { text: commentCount }), commentCount === 1 ? 'comment' : 'comments')
    )
  )
}

async function init() {
  const content = document.querySelector('#content')
  const userFilter = getParam('user')
  showLoading(content, 6)

  try {
    const [allPosts, users, comments] = await Promise.all([getPosts(), getUsers(), getComments()])
    const usersById = new Map(users.map(user => [user.id, user]))
    const commentCounts = comments.reduce((totals, comment) => {
      totals[comment.postId] = (totals[comment.postId] ?? 0) + 1
      return totals
    }, {})

    let posts = allPosts
    const children = []

    if (userFilter) {
      const author = usersById.get(Number(userFilter))
      if (!author) throw new Error('not-found')
      posts = allPosts.filter(post => post.userId === author.id)
      document.querySelector('#page-title').textContent = `Posts by ${author.name}`
      document.title = `Posts by ${author.name} · JSONPlaceholder Archive`
      children.push(
        el(
          'p',
          { class: 'card__meta' },
          el('span', { text: `Showing ${posts.length} of ${allPosts.length} posts.` }),
          el('a', { href: 'posts.html', text: 'Show all posts' })
        )
      )
    }

    const list = el('ol', { class: 'grid' })
    const moreWrap = el('div', { class: 'load-more' })
    let shown = 0

    const showMore = () => {
      const cards = posts
        .slice(shown, shown + PAGE_SIZE)
        .map(post => postCard(post, usersById.get(post.userId), commentCounts[post.id] ?? 0))
      list.append(...cards)
      reveal(cards)
      shown += cards.length
      if (shown >= posts.length) moreWrap.remove()
      else moreButton.lastChild.textContent = `Show more (${posts.length - shown} left)`
    }

    const moreButton = iconButton(icons.more, 'Show more', { onclick: showMore })
    moreWrap.append(moreButton)

    doneLoading(content, ...children, list, moreWrap)
    showMore()
  } catch (error) {
    showError(content, error)
  }
}

init()

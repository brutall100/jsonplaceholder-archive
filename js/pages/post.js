import { el, getParam, plural } from '../dom.js'
import { getCommentsByPost, getPost, getUser } from '../api.js'
import { avatar } from '../art.js'
import { icons } from '../icons.js'
import { initLayout, showLoading, doneLoading, showError, iconButton } from '../layout.js'
import { reveal } from '../effects.js'

initLayout()

// API text uses "\n" inside sentences; show it as one flowing paragraph.
const flatten = text => text.replace(/\s*\n\s*/g, ' ')

function article(post, user) {
  return el(
    'article',
    { class: 'card article' },
    el('span', { class: 'card__tab', text: `No. ${String(post.id).padStart(3, '0')}` }),
    el('p', { class: 'card__meta' }, el('span', { class: 'author' }, avatar(user, 40), 'Written by ', el('a', { href: `user.html?id=${user.id}`, text: user.name }))),
    el('p', { class: 'article__body', text: flatten(post.body) }),
    el(
      'div',
      { class: 'article__footer' },
      iconButton(icons.arrow, `More posts by ${user.name.split(' ')[0]}`, { href: `posts.html?user=${user.id}` }),
      el('a', { href: 'posts.html', text: 'All posts' })
    )
  )
}

function commentCard(comment, index) {
  return el(
    'li',
    { class: 'card comment', id: `comment-${comment.id}` },
    el('span', { class: 'card__tab', text: `Reply ${index + 1}` }),
    el('h3', { text: comment.name }),
    el('p', { text: flatten(comment.body) }),
    el('p', { class: 'comment__email' }, el('a', { href: `mailto:${comment.email}`, text: comment.email }))
  )
}

async function init() {
  const content = document.querySelector('#content')
  const id = getParam('id')
  showLoading(content, 3, 'stack')

  try {
    if (!id) throw new Error('not-found')
    const [post, comments] = await Promise.all([getPost(id), getCommentsByPost(id)])
    if (!post.id) throw new Error('not-found')
    const user = await getUser(post.userId)

    const title = document.querySelector('#page-title')
    title.textContent = post.title
    title.style.textTransform = 'capitalize'
    document.title = `${post.title} · JSONPlaceholder Archive`

    const cards = comments.map(commentCard)
    const letter = article(post, user)
    doneLoading(
      content,
      letter,
      el(
        'section',
        { class: 'comments', 'aria-labelledby': 'comments-title' },
        el('h2', { class: 'section-title', id: 'comments-title', text: plural(comments.length, 'comment') }),
        el('ol', { class: 'stack' }, cards)
      )
    )
    reveal([letter, ...cards])

    // Links from search results point at a single comment.
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView()
  } catch (error) {
    showError(content, error)
  }
}

init()

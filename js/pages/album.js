import PhotoSwipeLightbox from '../../vendor/photoswipe/photoswipe-lightbox.esm.min.js'
import { el, getParam, plural } from '../dom.js'
import { getAlbum, getPhotosByAlbum, getUser } from '../api.js'
import { postcard, postcardUri } from '../art.js'
import { initLayout, showLoading, doneLoading, showError } from '../layout.js'
import { reveal } from '../effects.js'

initLayout()

function photoItem(photo, index) {
  const tilt = ((photo.id * 37) % 7) - 3
  return el(
    'li',
    {},
    el(
      'a',
      {
        href: postcardUri(photo.id),
        'data-pswp-width': 1200,
        'data-pswp-height': 900,
        'data-caption': photo.title,
        style: `--tilt:${tilt}deg`,
        'aria-label': `Open photo: ${photo.title}`
      },
      postcard(photo.id, { width: 300, height: 225, alt: photo.title, lazy: index > 7 })
    )
  )
}

function initLightbox() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery',
    children: 'a',
    bgOpacity: 0.92,
    pswpModule: () => import('../../vendor/photoswipe/photoswipe.esm.min.js')
  })

  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (element, pswp) => {
        pswp.on('change', () => {
          element.textContent = pswp.currSlide.data.element?.dataset.caption ?? ''
        })
      }
    })
  })

  lightbox.init()
}

async function init() {
  const content = document.querySelector('#content')
  const id = getParam('id')
  showLoading(content, 8, 'gallery')

  try {
    if (!id) throw new Error('not-found')
    const [album, photos] = await Promise.all([getAlbum(id), getPhotosByAlbum(id)])
    if (!album.id) throw new Error('not-found')
    const user = await getUser(album.userId)

    const title = document.querySelector('#page-title')
    title.textContent = album.title
    title.style.textTransform = 'capitalize'
    document.title = `${album.title} · JSONPlaceholder Archive`

    const items = photos.map(photoItem)
    doneLoading(
      content,
      el(
        'p',
        { class: 'card__meta' },
        el('span', {}, 'Collected by ', el('a', { href: `user.html?id=${user.id}`, text: user.name })),
        el('span', { class: 'stamp', text: plural(photos.length, 'photo') }),
        el('a', { href: 'albums.html', text: 'All albums' })
      ),
      el('ul', { class: 'gallery', id: 'gallery' }, items)
    )
    reveal(items)
    initLightbox()
  } catch (error) {
    showError(content, error)
  }
}

init()

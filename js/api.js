// All requests to JSONPlaceholder go through here.
export const API_URL = 'https://jsonplaceholder.typicode.com'

const cache = new Map()

async function request(path) {
  if (!cache.has(path)) {
    const promise = fetch(`${API_URL}${path}`).then(async response => {
      if (!response.ok) throw new Error(response.status === 404 ? 'not-found' : `HTTP ${response.status}`)
      const total = Number(response.headers.get('x-total-count'))
      return { data: await response.json(), total }
    })
    promise.catch(() => cache.delete(path))
    cache.set(path, promise)
  }
  return cache.get(path)
}

async function get(path) {
  return (await request(path)).data
}

// Asks for one item only and reads the total from the X-Total-Count header.
export async function count(resource, query = '') {
  const { total } = await request(`/${resource}?_limit=1${query}`)
  return total
}

export const getUsers = () => get('/users')
export const getUser = id => get(`/users/${encodeURIComponent(id)}`)
export const getPosts = () => get('/posts')
export const getPost = id => get(`/posts/${encodeURIComponent(id)}`)
export const getPostsByUser = id => get(`/posts?userId=${encodeURIComponent(id)}`)
export const getComments = () => get('/comments')
export const getCommentsByPost = id => get(`/comments?postId=${encodeURIComponent(id)}`)
export const getAlbums = () => get('/albums')
export const getAlbum = id => get(`/albums/${encodeURIComponent(id)}`)
export const getAlbumsByUser = id => get(`/albums?userId=${encodeURIComponent(id)}`)
export const getPhotosByAlbum = id => get(`/photos?albumId=${encodeURIComponent(id)}`)

export async function getAlbumCover(id) {
  const { data, total } = await request(`/photos?albumId=${encodeURIComponent(id)}&_limit=1`)
  return { photo: data[0], total }
}

export function search(resource, query, limit = 10) {
  return request(`/${resource}?q=${encodeURIComponent(query)}&_limit=${limit}`)
}

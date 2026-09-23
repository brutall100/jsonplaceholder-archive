// Tiny helper for building elements without innerHTML (API text is never parsed as HTML).
export function el(tag, props = {}, ...children) {
  const element = document.createElement(tag)

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue
    if (key === 'class') element.className = value
    else if (key === 'text') element.textContent = value
    else if (key === 'style') element.style.cssText = value
    else if (key.startsWith('on')) element.addEventListener(key.slice(2), value)
    else if (key in element && !key.includes('-')) element[key] = value
    else element.setAttribute(key, value === true ? '' : value)
  }

  element.append(...children.flat().filter(child => child !== null && child !== undefined && child !== false))
  return element
}

export function getParam(name) {
  return new URLSearchParams(location.search).get(name)
}

// Wraps every match of `query` in <mark>, safely.
export function highlight(text, query) {
  const fragment = document.createDocumentFragment()
  if (!query) {
    fragment.append(text)
    return fragment
  }

  const lower = text.toLowerCase()
  const needle = query.toLowerCase()
  let start = 0
  let index = lower.indexOf(needle)

  while (index !== -1) {
    fragment.append(text.slice(start, index), el('mark', { text: text.slice(index, index + needle.length) }))
    start = index + needle.length
    index = lower.indexOf(needle, start)
  }

  fragment.append(text.slice(start))
  return fragment
}

export function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

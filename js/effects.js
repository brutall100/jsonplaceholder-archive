// Micro-interactions: button ripple + stamp "thunk", reveal on scroll, count-up numbers.
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export function initButtons() {
  document.addEventListener('pointerdown', event => {
    const button = event.target.closest('.btn')
    if (!button || reducedMotion()) return

    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px`
    button.append(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())

    button.classList.remove('is-stamping')
    void button.offsetWidth
    button.classList.add('is-stamping')
  })
}

let observer

export function reveal(elements) {
  const list = [...elements]
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    list.forEach(element => element.classList.add('reveal', 'is-visible'))
    return
  }

  observer ??= new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -40px 0px' }
  )

  list.forEach((element, index) => {
    element.classList.add('reveal')
    element.style.setProperty('--delay', `${(index % 6) * 70}ms`)
    observer.observe(element)
  })
}

export function countUp(element, target, duration = 1400) {
  if (reducedMotion()) {
    element.textContent = target.toLocaleString('en-US')
    return
  }

  const start = performance.now()
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    element.textContent = Math.round(target * eased).toLocaleString('en-US')
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

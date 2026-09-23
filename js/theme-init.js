// Runs before the page paints, so a saved theme never flashes the wrong colours.
(function () {
  try {
    var saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved)
    }
  } catch (error) {
    // Storage can be blocked (private mode). The system theme is used then.
  }
})()

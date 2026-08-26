(() => {
  const nativeHome = '/workspace'

  if (window.location.pathname === '/' || window.location.pathname === '/app') {
    window.history.replaceState(window.history.state, '', nativeHome)
  }

  const syncPath = () => {
    const apply = () => {
      if (!document.body) return
      document.documentElement.dataset.nativeApp = 'true'
      document.body.dataset.nativePath = window.location.pathname
      installHomeButton()
      hideAppearanceSection()
    }
    apply()
    if (!document.body) document.addEventListener('DOMContentLoaded', apply, { once: true })
  }

  const rewriteDeviceWording = (root) => {
    if (!(root instanceof Node)) return
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)

    for (const node of nodes) {
      const parent = node.parentElement
      if (!parent || !parent.closest('.workspace-shell')) continue
      const current = node.nodeValue || ''
      const next = current
        .replace(/not stored in this browser/gi, 'not stored on this device')
        .replace(/stored in this browser/gi, 'stored on this device')
        .replace(/saved in this browser/gi, 'saved on this device')
        .replace(/from this browser/gi, 'from this device')
        .replace(/browser workspace/gi, 'device workspace')
        .replace(/this browser/gi, 'this device')
      if (next !== current) node.nodeValue = next
    }
  }

  const installHomeButton = () => {
    const trailing = document.querySelector('.workspace-mobile-trailing')
    if (!trailing) return

    if (window.location.pathname === '/workspace') {
      trailing.replaceChildren()
      return
    }

    if (trailing.querySelector('.native-home-button')) return

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'native-home-button'
    button.setAttribute('aria-label', 'Go to Home')
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.5l8.5 7v9a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" /></svg>'
    button.addEventListener('click', () => {
      window.history.pushState({}, '', nativeHome)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    trailing.replaceChildren(button)
  }

  const hideAppearanceSection = () => {
    const sections = document.querySelectorAll('.settings-section')
    for (const section of sections) {
      const heading = section.querySelector('h2')?.textContent?.trim().toLowerCase()
      section.classList.toggle('native-hide-appearance', heading === 'appearance')
    }
  }

  const tryNativeShare = async (anchor) => {
    if (!navigator.share || !navigator.canShare) return false
    const href = anchor.href
    if (!href.startsWith('blob:')) return false

    try {
      const response = await fetch(href)
      const blob = await response.blob()
      const file = new File([blob], anchor.download || 'meddxagent-cases.json', { type: blob.type || 'application/json' })
      if (!navigator.canShare({ files: [file] })) return false
      await navigator.share({ files: [file], title: 'MEDDxAgent cases' })
      return true
    } catch {
      return false
    }
  }

  document.addEventListener('click', async (event) => {
    const anchor = event.target instanceof Element ? event.target.closest('a[download]') : null
    if (!anchor) return
    const shared = await tryNativeShare(anchor)
    if (shared) event.preventDefault()
  }, true)

  for (const method of ['pushState', 'replaceState']) {
    const original = window.history[method]
    window.history[method] = function (...args) {
      const result = original.apply(this, args)
      window.dispatchEvent(new Event('meddx-native-location-change'))
      return result
    }
  }

  window.addEventListener('popstate', syncPath)
  window.addEventListener('meddx-native-location-change', syncPath)
  window.addEventListener('meddx-native-location-change', () => rewriteDeviceWording(document.body))
  document.addEventListener('DOMContentLoaded', () => {
    syncPath()
    rewriteDeviceWording(document.body)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) rewriteDeviceWording(node)
      }
      installHomeButton()
      hideAppearanceSection()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })

  syncPath()
})()

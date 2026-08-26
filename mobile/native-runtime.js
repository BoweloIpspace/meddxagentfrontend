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

  const originalAnchorClick = HTMLAnchorElement.prototype.click
  const originalRevokeObjectURL = URL.revokeObjectURL.bind(URL)
  const pendingNativeShares = new Set()

  URL.revokeObjectURL = (url) => {
    if (pendingNativeShares.has(url)) return
    originalRevokeObjectURL(url)
  }

  HTMLAnchorElement.prototype.click = function () {
    const anchor = this
    const href = anchor.href
    const filename = anchor.download
    const shareAvailable =
      filename &&
      href.startsWith('blob:') &&
      typeof navigator.share === 'function' &&
      typeof File === 'function'

    if (!shareAvailable) {
      return originalAnchorClick.call(anchor)
    }

    pendingNativeShares.add(href)
    fetch(href)
      .then((response) => response.blob())
      .then(async (blob) => {
        const file = new File([blob], filename, { type: blob.type || 'application/json' })
        const payload = { title: 'MEDDxAgent cases', files: [file] }
        if (typeof navigator.canShare === 'function' && !navigator.canShare(payload)) {
          originalAnchorClick.call(anchor)
          return
        }
        await navigator.share(payload)
      })
      .catch(() => originalAnchorClick.call(anchor))
      .finally(() => {
        pendingNativeShares.delete(href)
        originalRevokeObjectURL(href)
      })
  }

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
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })

  syncPath()
})()

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
        .replace(/this browser/gi, 'this device')
        .replace(/browser workspace/gi, 'device workspace')
        .replace(/stored in the browser/gi, 'stored on the device')
        .replace(/stored in browser/gi, 'stored on device')
      if (next !== current) node.nodeValue = next
    }
  }

  const nativeHistoryEvent = new Event('meddx-native-location-change')
  for (const method of ['pushState', 'replaceState']) {
    const original = window.history[method]
    window.history[method] = function (...args) {
      const result = original.apply(this, args)
      window.dispatchEvent(nativeHistoryEvent)
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

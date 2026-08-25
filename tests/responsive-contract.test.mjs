import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8')
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const css = await readFile(new URL('../src/responsive-platform.css', import.meta.url), 'utf8')

test('responsive platform layer is loaded last', () => {
  const platformIndex = main.indexOf("import './responsive-platform.css'")
  const productionIndex = main.indexOf("import './production-polish.css'")
  assert.ok(platformIndex > productionIndex)
})

test('viewport supports safe areas for native shells', () => {
  assert.match(html, /viewport-fit=cover/)
})

test('tablet app header matches AppShell three-cell structure', () => {
  assert.match(css, /grid-template-columns:\s*44px minmax\(0, 1fr\) 44px/)
  assert.match(css, /@media \(min-width: 768px\) and \(max-width: 1023px\)/)
})

test('mobile form controls avoid focus zoom and respect keyboard space', () => {
  assert.match(css, /font-size:\s*16px/)
  assert.match(css, /scroll-margin-bottom:\s*35dvh/)
  assert.match(css, /:has\(input:focus, textarea:focus, select:focus\)/)
})

test('mobile shell retains safe-area insets and coarse-pointer targets', () => {
  assert.match(css, /env\(safe-area-inset-top\)/)
  assert.match(css, /env\(safe-area-inset-bottom\)/)
  assert.match(css, /@media \(hover: none\) and \(pointer: coarse\)/)
})

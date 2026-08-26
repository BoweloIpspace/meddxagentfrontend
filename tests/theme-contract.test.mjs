import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8')
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const themeProvider = await readFile(new URL('../src/theme/ThemeProvider.tsx', import.meta.url), 'utf8')
const themeContext = await readFile(new URL('../src/theme/theme-context.ts', import.meta.url), 'utf8')
const themeCss = await readFile(new URL('../src/dark-mode.css', import.meta.url), 'utf8')

test('dark mode layer is loaded after the responsive platform layer', () => {
  assert.ok(main.indexOf("import './dark-mode.css'") > main.indexOf("import './responsive-platform.css'"))
})

test('theme is applied before React loads to avoid an appearance flash', () => {
  assert.match(html, /meddxagent:theme:v1/)
  assert.match(html, /document\.documentElement\.dataset\.theme/)
  assert.ok(html.indexOf('dataset.theme') < html.indexOf('/src/main.tsx'))
})

test('theme preference supports device appearance and persists safely', () => {
  assert.match(themeContext, /"light" \| "dark" \| "system"/)
  assert.match(themeProvider, /prefers-color-scheme: dark/)
  assert.match(themeProvider, /localStorage\.setItem/)
  assert.match(themeProvider, /addEventListener\("change"/)
})

test('dark mode covers mobile chrome, controls, and safe touch targets', () => {
  assert.match(themeCss, /\.workspace-mobile-header/)
  assert.match(themeCss, /\.workspace-mobile-bottom-nav/)
  assert.match(themeCss, /input:focus/)
  assert.match(themeCss, /@media \(hover: none\) and \(pointer: coarse\)/)
  assert.match(themeCss, /min-height:\s*44px/)
})

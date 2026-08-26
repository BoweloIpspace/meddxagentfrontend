import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(here, '../dist')
const nativeDir = path.resolve(here, 'www')
const indexPath = path.join(nativeDir, 'index.html')
const typographySource = path.join(here, 'native-typography.css')
const typographyTarget = path.join(nativeDir, 'native-typography.css')

await rm(nativeDir, { recursive: true, force: true })
await mkdir(nativeDir, { recursive: true })
await cp(sourceDir, nativeDir, { recursive: true })
await cp(typographySource, typographyTarget)

const stylesheetTag = '<link rel="stylesheet" href="/native-typography.css">'
const html = await readFile(indexPath, 'utf8')

if (!html.includes('</head>')) {
  throw new Error('Unable to prepare native build: dist/index.html has no </head> tag')
}

const prepared = html.includes(stylesheetTag)
  ? html
  : html.replace('</head>', `  ${stylesheetTag}\n</head>`)

await writeFile(indexPath, prepared)
console.log('Prepared native assets in mobile/www without modifying the web dist build.')

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(here, '../dist')
const nativeDir = path.resolve(here, 'www')
const indexPath = path.join(nativeDir, 'index.html')
const nativeAssets = [
  'native-typography.css',
  'native-app.css',
  'native-runtime.js',
]

await rm(nativeDir, { recursive: true, force: true })
await mkdir(nativeDir, { recursive: true })
await cp(sourceDir, nativeDir, { recursive: true })

for (const asset of nativeAssets) {
  await cp(path.join(here, asset), path.join(nativeDir, asset))
}

const nativeTags = [
  '<link rel="stylesheet" href="/native-typography.css">',
  '<link rel="stylesheet" href="/native-app.css">',
  '<script src="/native-runtime.js"></script>',
].join('\n  ')

const html = await readFile(indexPath, 'utf8')

if (!html.includes('</head>')) {
  throw new Error('Unable to prepare native build: dist/index.html has no </head> tag')
}

const prepared = html.includes('/native-runtime.js')
  ? html
  : html.replace('</head>', `  ${nativeTags}\n</head>`)

await writeFile(indexPath, prepared)
console.log('Prepared native assets in mobile/www without modifying the web dist build.')

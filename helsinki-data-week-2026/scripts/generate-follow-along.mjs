import QRCode from 'qrcode'
import { writeFile } from 'node:fs/promises'

const followAlongUrl = 'https://dumkydewilde.github.io/talks/helsinki-data-week-2026/'
const svg = await QRCode.toString(followAlongUrl, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 1,
  color: { dark: '#383838', light: '#FFFFFF' },
})

await writeFile(new URL('../public/follow-along.svg', import.meta.url), svg)

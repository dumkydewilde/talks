import { test, expect } from '@playwright/test'

test('all 20 slides render without errors, broken images, or footer overlaps', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (let slide = 1; slide <= 20; slide++) {
    await page.goto(`/${slide}`)
    const root = page.locator(`.slidev-page-${slide} .md-slide`)
    await expect(root).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    await expect(root.locator('.deck-footer')).toContainText(String(slide).padStart(2, '0'))
    const problems = await root.evaluate(async root => {
      await Promise.all([...root.querySelectorAll('img')].map(img => img.decode().catch(() => {})))
      const footerTop = root.querySelector('.deck-footer')!.getBoundingClientRect().top
      return {
        broken: [...root.querySelectorAll('img')].filter(img => !img.naturalWidth).map(img => img.src),
        overlaps: [...root.querySelectorAll('main > *, main > div > *')].filter(el => el.getBoundingClientRect().bottom > footerTop + 1).map(el => el.className),
      }
    })
    expect(problems, `Slide ${slide}`).toEqual({ broken: [], overlaps: [] })
  }
  expect(errors).toEqual([])
})

test('follow-along QR is on the cover and takeaway; resources include speaker and demo links', async ({ page }) => {
  const followAlongUrl = 'https://dumkydewilde.github.io/talks/helsinki-data-week-2026/'
  for (const slide of [1, 14]) {
    await page.goto(`/${slide}`)
    const root = page.locator(`.slidev-page-${slide}`)
    await expect(root.locator('.follow-along img')).toHaveAttribute('src', '/follow-along.svg')
    await expect(root.locator('.follow-along a')).toHaveAttribute('href', followAlongUrl)
  }

  await page.goto('/20')
  const resources = page.locator('.slidev-page-20')
  await expect(resources.locator('.resource-card a')).toHaveCount(6)
  await expect(resources.getByRole('link', { name: /Dumky de Wilde/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/dumkydewilde/')
  await expect(resources.getByRole('link', { name: /Adrian Brudaru/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/data-team/')
  await expect(resources.getByRole('link', { name: /Amy Raygada/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/amy-raygada/')
  await expect(resources.getByRole('link', { name: /Stijn Zanders/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/stijnzanders/')
  await expect(resources.getByRole('link', { name: /Cookbook recipe/ })).toHaveAttribute('href', 'https://motherduck.com/docs/cookbook/interview-transcript-insights/')
  await expect(resources.getByRole('link', { name: /Explore the Dive/ })).toHaveAttribute('href', 'https://motherduck.com/dive-gallery/dives/interview-insights')
})

test('show-of-hands highlight toggles without pretending to count votes', async ({ page }) => {
  await page.goto('/5')
  const option = page.getByRole('button', { name: /Getting the data/ })
  await option.click()
  await expect(option).toHaveAttribute('aria-pressed', 'true')
  await option.click()
  await expect(option).toHaveAttribute('aria-pressed', 'false')
})

test('header fullscreen button enters and exits presentation fullscreen', async ({ page }) => {
  await page.goto('/3')
  const root = page.locator('.slidev-page-3')
  const enter = root.getByRole('button', { name: 'Enter fullscreen', exact: true })
  await expect(enter).toBeVisible()
  await enter.click()
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true)
  const exit = root.getByRole('button', { name: 'Exit fullscreen', exact: true })
  await expect(exit).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/4$/)
  const nextSlide = page.locator('.slidev-page-4')
  await nextSlide.getByRole('button', { name: 'Exit fullscreen', exact: true }).click()
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)
  await expect(nextSlide.getByRole('button', { name: 'Enter fullscreen', exact: true })).toHaveAttribute('aria-pressed', 'false')
})

test('learning loop shows all six Design Sprint phases without a slider', async ({ page }) => {
  await page.goto('/6')
  const root = page.locator('.slidev-page-6')
  await expect(root.getByRole('slider')).toHaveCount(0)
  await expect(root.locator('.phase-name')).toHaveText(['Understand', 'Define', 'Sketch', 'Decide', 'Prototype', 'Validate'])
  await expect(root.locator('.sprint-diamond')).toHaveCount(3)
  await expect(root.locator('.sprint-possibilities path')).toHaveCount(5)
  await expect(root.locator('.sprint-squiggle')).toHaveCount(1)
  await expect(root.locator('.sprint-tested-path')).toHaveCount(1)
  await expect(root.locator('.sprint-return')).toHaveCount(1)
  await expect(root.getByRole('img', { name: 'The Design Sprint learning loop' })).toBeVisible()
  await expect(root.getByRole('link', { name: /Google’s Design Sprint Kit/ })).toHaveAttribute('href', 'https://designsprintkit.withgoogle.com/methodology/overview')
  const diagram = await root.locator('.sprint-diagram').boundingBox()
  const credit = await root.locator('.sprint-credit').boundingBox()
  expect(diagram!.y + diagram!.height).toBeLessThan(credit!.y)
})

test('time-to-insight how separates model capability from human guidance', async ({ page }) => {
  await page.goto('/7')
  const root = page.locator('.slidev-page-7')
  await expect(root.locator('h1')).toHaveText('Models are speeding up. Let people guide.')
  const cards = root.locator('.insight-how-card')
  await expect(cards).toHaveCount(2)
  await expect(cards.nth(0)).toContainText('01 / MODELS')
  await expect(cards.nth(0)).toContainText('Take on more complex tasks, at faster speeds.')
  await expect(cards.nth(0)).toContainText('Build reliability through tests, evidence, and repeatable results, not blind trust.')
  await expect(cards.nth(1)).toContainText('02 / PEOPLE')
  await expect(cards.nth(1)).toContainText('Bring domain knowledge and guiding principles.')
  await expect(cards.nth(1)).toContainText('Set safe boundaries. Step aside within them.')
  await expect(cards.nth(1)).toContainText('Review exceptions.')
  await expect(root.locator('.bottom-line')).toHaveText('Be a gatekeeper. Not a bottleneck.')
  const model = await cards.nth(0).boundingBox()
  const human = await cards.nth(1).boundingBox()
  expect(model!.y).toBeCloseTo(human!.y, 0)
  expect(model!.x + model!.width).toBeLessThan(human!.x)
})

test('writer selection retains the overview and can be reset', async ({ page }) => {
  await page.goto('/2')
  const root = page.locator('.slidev-page-2')
  const paths = root.locator('.spacing-chart svg path')
  await expect(paths.first()).toBeVisible()
  const before = await paths.count()
  await page.getByRole('button', { name: 'Follow one writer' }).click()
  await expect(root.locator('.mini-heading')).toContainText('Agent')
  expect(await paths.count()).toBe(before)
  await page.getByRole('button', { name: 'Show overview' }).click()
  await expect(root.locator('.mini-heading')).toContainText('All writers')
})

test('real communication excerpts follow the agent chart with original spacing', async ({ page }) => {
  await page.goto('/2')
  await expect(page.locator('.slidev-page-2 .spacing-widget')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/3$/)
  const root = page.locator('.slidev-page-3')
  await expect(root.locator('h1')).toHaveText('Same instructions. Fewer spaces.')
  await expect(root.locator('.communication-example blockquote')).toHaveText([
    'Libraryrunner19pass3fail,8crossrouteLOGINscreenshotsREJECTED; nofullgate/readinessclaim. Yourrepairmustpreserveproofs andseparatemeasuredspeedvsjustifiedtimeoutbudget; no model/UIfunctionalchanges.',
    'FinishyourONEproviderfreebatchwithinexisting5mincap,preserveerrors/durableproof/cleanupandEXPLICIT4391releasepromptly, noextrabatch/fullgate/build/push. ParentwillgrantHaikufocused4241immediatelyafteryourrelease; no pressuretofakegreen. Deterministic/scriptedproofboundarykept,0paidcalls.',
    'No prompttuning/validatorphrasepatch/reprobe/anothermodel/bakeoffjusttogreen, no seededsubstitution. PreserveSANITIZEDrawsyntheticevidence/reviewlimitationsandpriorharnessfailuresinCOMMITTEDdocs/testsartifactsasappropriate(no secrets), writeactualnegativefindinganddownstreamUNREACHEDsteps.',
  ])
  await expect(root.locator('.communication-examples p, .communication-label, .communication-source')).toHaveCount(0)
})

test('text-only question follows the agent excerpts and emphasizes for', async ({ page }) => {
  await page.goto('/3')
  await expect(page.locator('.slidev-page-3 .communication-examples')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/4$/)
  const content = page.locator('.slidev-page-4 .slide-content')
  await expect(content).toHaveText('Our tools are now faster then we are. How do we make them work for us.')
  await expect(content.locator(':scope > *')).toHaveCount(1)
  await expect(content.locator('h1 em')).toHaveText('for')
})

test('interview recording autoplays muted, seeks, pauses on leave, and restarts on return', async ({ page }) => {
  const motherDuckRequests: string[] = []
  page.on('request', request => {
    if (new URL(request.url()).hostname.endsWith('motherduck.com')) motherDuckRequests.push(request.url())
  })
  await page.goto('/10')
  const root = page.locator('.slidev-page-10')
  const video = root.getByLabel('Interview insights screen recording')
  await expect(video).toBeVisible()
  await expect(video).toHaveAttribute('controls', '')
  await expect(video).toHaveAttribute('autoplay', '')
  expect(await video.evaluate((video: HTMLVideoElement) => video.muted)).toBe(true)
  await expect(video.locator('source')).toHaveAttribute('src', '/examples/interview-insights.mp4')
  await expect(root.locator('.interview-widget, a[href*="app.motherduck.com"]')).toHaveCount(0)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  const duration = await video.evaluate((video: HTMLVideoElement) => video.duration)
  expect(duration).toBeGreaterThan(31)
  expect(duration).toBeLessThan(32)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0)
  await video.evaluate((video: HTMLVideoElement) => { video.pause(); video.currentTime = 15 })
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.seeking)).toBe(false)
  expect(await video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeCloseTo(15, 0)
  await video.evaluate(async (video: HTMLVideoElement) => { await video.play(); video.blur() })
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/11$/)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true)
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/\/10$/)
  await expect(video).toBeVisible()
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false)
  expect(await video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeLessThan(5)
  expect(motherDuckRequests).toEqual([])
})

test('preloaded interview recording stays paused until its slide is entered', async ({ page }) => {
  await page.goto('/9')
  const video = page.locator('.slidev-page-10 video')
  await expect(video).toHaveCount(1)
  await expect(video).not.toHaveAttribute('autoplay')
  expect(await video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true)
  expect(await video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBe(0)
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/10$/)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0)
})

test('five-stage diagram follows the recording with human review before Jev analysis', async ({ page }) => {
  await page.goto('/10')
  await expect(page.locator('.slidev-page-10 video')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/11$/)
  const root = page.locator('.slidev-page-11')
  await expect(root.getByRole('img', { name: 'From the Dive app to human-reviewed insights' })).toBeVisible()
  await expect(root.locator('.interview-flow-title')).toHaveText(['Dive', 'Flight', 'Human', 'Flight', 'Dive'])
  await expect(root.locator('.interview-flow-action')).toHaveText(['App', 'Load data', 'Review & editthe codebook', 'SQL analysiswith Jev', 'Insights'])
  await expect(root.locator('.interview-flow-arrow')).toHaveCount(4)
  await expect(root.locator('.interview-flow-human .interview-flow-title')).toHaveText('Human')
  const steps = await root.locator('.interview-flow-step').all()
  for (let i = 1; i < steps.length; i++) {
    const previous = await steps[i - 1].boundingBox()
    const current = await steps[i].boundingBox()
    expect(previous!.x + previous!.width).toBeLessThan(current!.x)
  }
})

test('nine Dives are visible together and enlarged examples close with Escape', async ({ page }) => {
  await page.goto('/12')
  await expect(page.locator('.slidev-page-12 h1')).toHaveCount(0)
  const tiles = page.locator('.slidev-page-12 .dive-tile')
  await expect(tiles).toHaveCount(9)
  for (const tile of await tiles.all()) await expect(tile).toBeInViewport()
  await expect(tiles.first().locator('.tile-caption')).toHaveCSS('font-size', '11px')
  expect(await tiles.first().locator('img').evaluate(img => img.clientHeight)).toBeGreaterThan(130)
  await tiles.nth(7).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('The vibe-coded web')
  await expect(page.getByRole('dialog').getByRole('link')).toHaveAttribute('href', 'https://motherduck.com/dive-gallery/dives/the-vibe-coded-web-measured-common-crawl/')
  await expect(page.getByRole('button', { name: 'Close enlarged Dive' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(tiles.nth(7)).toBeFocused()
  await expect(page).toHaveURL(/\/12$/)
})

test('panel themes reveal the right follow-up', async ({ page }) => {
  await page.goto('/17')
  await page.getByRole('tab', { name: /Access for everyone/ }).click()
  await expect(page.getByRole('tabpanel')).toContainText('access to a data agent')
  await expect(page.getByRole('tabpanel')).toContainText('Who approves an agent taking action?')
})

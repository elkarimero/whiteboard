import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
})

// 2.1 — Scenario: Double-clicking on the canvas creates a note
test('double-clicking on the canvas creates a note', async ({ page }) => {
  await expect(page.getByTestId('sticky-note')).toHaveCount(0)

  await page.dblclick('[data-testid="canvas"]')

  await expect(page.getByTestId('sticky-note')).toHaveCount(1)
  await expect(page.getByTestId('sticky-note')).toBeVisible()
})

// 2.2 — Scenario: Select a sticky note
test('clicking on a note selects it', async ({ page }) => {
  await page.dblclick('[data-testid="canvas"]')

  await page.click('[data-testid="sticky-note"]')

  await expect(page.getByTestId('sticky-note')).toHaveAttribute('data-selected', 'true')
})

// 2.3 — Scenario: Enter edit mode on a sticky note
test('double-clicking on a note enters edit mode', async ({ page }) => {
  await page.dblclick('[data-testid="canvas"]')

  await page.dblclick('[data-testid="sticky-note"]')

  await expect(page.getByTestId('note-text')).toHaveAttribute('contenteditable', 'true')
})

// 2.4 — Scenario: Update content while in edit mode + Exit edit mode
test('typing in edit mode updates the note and saves on blur', async ({ page }) => {
  await page.dblclick('[data-testid="canvas"]')
  await page.dblclick('[data-testid="sticky-note"]')

  await page.getByTestId('note-text').type('Hello world')
  await page.click('[data-testid="canvas"]')

  await expect(page.getByTestId('note-text')).toContainText('Hello world')
  await expect(page.getByTestId('note-text')).toHaveAttribute('contenteditable', 'false')
})

// 2.5 — Scenario: Delete a selected sticky note via Delete key
test('pressing Delete removes the selected note', async ({ page }) => {
  await page.dblclick('[data-testid="canvas"]')
  await page.click('[data-testid="sticky-note"]')

  await page.keyboard.press('Delete')

  await expect(page.getByTestId('sticky-note')).toHaveCount(0)
})

// 2.6 — Scenario: Delete via × button
test('clicking the delete button removes the note', async ({ page }) => {
  await page.dblclick('[data-testid="canvas"]')

  await page.click('[data-testid="delete-btn"]')

  await expect(page.getByTestId('sticky-note')).toHaveCount(0)
})

// 2.7 — Scenario: Drag and drop a sticky note
test('dragging a note moves it to a new position', async ({ page }) => {
  await page.dblclick('[data-testid="canvas"]')
  const note = page.getByTestId('sticky-note')

  const before = await note.boundingBox()
  await note.dragTo(page.getByTestId('canvas'), {
    targetPosition: { x: 600, y: 400 },
  })
  const after = await note.boundingBox()

  expect(after!.x).not.toBeCloseTo(before!.x, 0)
  expect(after!.y).not.toBeCloseTo(before!.y, 0)
})

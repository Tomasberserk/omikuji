import test from 'node:test'
import assert from 'node:assert/strict'
import { FORTUNES } from '../src/data/fortunes.js'
import { pickFortune } from '../src/lib/pickFortune.js'

test('never repeats the previous fortune', () => {
  for (const previous of FORTUNES) {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const next = pickFortune(FORTUNES, previous.id)
      assert.notEqual(next.id, previous.id)
    }
  }
})

test('is deterministic when random is injected', () => {
  assert.equal(pickFortune(FORTUNES, null, () => 0).id, FORTUNES[0].id)
  assert.equal(
    pickFortune(FORTUNES, null, () => 0.999999).id,
    FORTUNES[FORTUNES.length - 1].id,
  )
})

test('falls back to the only fortune when there is nothing else', () => {
  const only = [FORTUNES[0]]
  assert.equal(pickFortune(only, FORTUNES[0].id).id, FORTUNES[0].id)
})

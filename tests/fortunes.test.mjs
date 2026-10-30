import test from 'node:test'
import assert from 'node:assert/strict'
import { FORTUNES } from '../src/data/fortunes.js'

const RANKS = ['大吉', '中吉', '小吉', '吉', '末吉']
const READINGS = ['Daikichi', 'Chūkichi', 'Shōkichi', 'Kichi', 'Suekichi']

test('has 15 fortunes with unique ids and numbers', () => {
  assert.equal(FORTUNES.length, 15)
  assert.equal(new Set(FORTUNES.map((fortune) => fortune.id)).size, 15)
  assert.equal(new Set(FORTUNES.map((fortune) => fortune.number)).size, 15)
})

test('every fortune has the required text', () => {
  for (const fortune of FORTUNES) {
    for (const key of ['typeEn', 'typeJp', 'kanji', 'theme', 'message', 'advice']) {
      assert.ok(fortune[key]?.trim(), `${fortune.id} is missing "${key}"`)
    }
    assert.ok(fortune.Icon, `${fortune.id} is missing an icon`)
  }
})

test('uses only positive ranks and clean romanization', () => {
  for (const fortune of FORTUNES) {
    assert.ok(RANKS.includes(fortune.kanji), `unexpected rank ${fortune.kanji}`)
    assert.ok(READINGS.includes(fortune.typeJp), `unexpected reading ${fortune.typeJp}`)
    assert.ok(!fortune.typeJp.includes('ī'), `macron in ${fortune.typeJp}`)
  }
})

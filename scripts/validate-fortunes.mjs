import { FORTUNES } from '../src/data/fortunes.js'
import * as lucide from 'lucide-react'

const problems = []
const ids = new Set()
const numbers = new Set()
const icons = new Set(Object.values(lucide))

for (const fortune of FORTUNES) {
  if (ids.has(fortune.id)) problems.push(`Duplicate id: ${fortune.id}`)
  ids.add(fortune.id)

  if (numbers.has(fortune.number)) problems.push(`Duplicate number: ${fortune.number}`)
  numbers.add(fortune.number)

  for (const key of ['typeEn', 'typeJp', 'kanji', 'theme', 'message', 'advice']) {
    if (!fortune[key]) problems.push(`Missing "${key}" in ${fortune.id}`)
  }

  if (!icons.has(fortune.Icon)) problems.push(`Unknown lucide icon in ${fortune.id}`)
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}

console.log(`OK: ${FORTUNES.length} fortunes, ${ids.size} unique ids, ${numbers.size} unique numbers.`)

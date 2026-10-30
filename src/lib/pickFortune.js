/**
 * Picks a random fortune, never repeating the previous one.
 * Falls back to the full list if there is only one fortune.
 */
export function pickFortune(fortunes, previousId, random = Math.random) {
  const pool = fortunes.filter((fortune) => fortune.id !== previousId)
  const source = pool.length > 0 ? pool : fortunes
  return source[Math.floor(random() * source.length)]
}

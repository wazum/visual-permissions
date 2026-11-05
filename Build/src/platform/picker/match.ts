export interface Match {
  readonly score: number
  readonly at: readonly number[]
}

// A letter that opens a word is worth finding: "hh" should reach "Hans Huber" before it reaches a name that merely holds those letters somewhere.
const startsWord = (haystack: string, index: number): boolean =>
  index === 0 || /[\s\-_.]/.test(haystack.charAt(index - 1))

function fromHere(start: number, wanted: string, searched: string, haystack: string): Match | null {
  const at = [start]
  let score = startsWord(haystack, start) ? 2 : 0
  let next = start + 1

  for (let step = 1; step < wanted.length; step += 1) {
    const found = searched.indexOf(wanted.charAt(step), next)
    if (found === -1) {
      return null
    }

    if (found === next) {
      score += 4
    }

    if (startsWord(haystack, found)) {
      score += 2
    }

    at.push(found)
    next = found + 1
  }

  // Match starting at the front is better than the same match later on
  return { score: start === 0 ? score + 2 : score, at }
}

export function match(needle: string, haystack: string): Match | null {
  if (needle === '') {
    return { score: 0, at: [] }
  }

  const wanted = needle.toLowerCase()
  const searched = haystack.toLowerCase()
  const first = wanted.charAt(0)

  let best: Match | null = null

  for (let start = searched.indexOf(first); start !== -1; start = searched.indexOf(first, start + 1)) {
    const tried = fromHere(start, wanted, searched, haystack)
    if (tried !== null && (best === null || tried.score > best.score)) {
      best = tried
    }
  }

  return best
}

export function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

// Match the original visualization: per writer, ±45 minutes; break at >90-minute gaps.
export function rollingSeries(messages) {
  const sorted = [...messages].sort((a, b) => a.at - b.at)
  return sorted.flatMap((m, i) => {
    const point = { at: m.at, spaces: median(sorted.filter(n => Math.abs(n.at - m.at) <= 45 * 60_000).map(n => n.spaces)) }
    return i && m.at - sorted[i - 1].at > 90 * 60_000 ? [null, point] : [point]
  })
}

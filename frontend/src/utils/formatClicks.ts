// Formats a click count into a compact string.
// < 1000            -> the full number            (e.g. 456)
// >= 1000           -> thousands + "k"            (e.g. 1k, 45k, 657k)
// >= 1_000_000      -> millions + "kk"            (e.g. 1.2kk, 54.6kk)
// each extra factor of 1000 adds another "k", and one more decimal of detail.
export const formatClicks = (clicks: number): string => {
  if (clicks < 1000) return `${clicks}`

  let tier = 0
  let value = clicks
  while (value >= 1000) {
    value /= 1000
    tier++
  }

  const decimals = tier - 1
  const factor = 10 ** decimals
  const truncated = Math.floor(value * factor) / factor

  let text = truncated.toFixed(decimals)
  if (text.includes(".")) {
    text = text.replace(/0+$/, "").replace(/\.$/, "")
  }

  return `${text}${"k".repeat(tier)}`
}

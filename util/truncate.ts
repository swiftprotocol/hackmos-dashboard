export default function truncateAddress(
  address: string,
  visibleFirst: number = 8,
  visibleLast: number = 4
) {
  return `${address.substring(0, visibleFirst)}...${address.substring(
    address.length - visibleLast,
    address.length
  )}`
}

export function truncateText(text: string, maxLength = 200) {
  if (text.length <= maxLength) return text

  // Find the last space within the maxLength limit
  let truncated = text.slice(0, maxLength)
  let lastSpace = truncated.lastIndexOf(' ')

  // Complete the last word if it gets cut off
  if (lastSpace > 0) truncated = truncated.slice(0, lastSpace)

  return truncated + '...'
}

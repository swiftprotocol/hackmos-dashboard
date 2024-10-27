import { marked } from 'marked'

function resolvePlaceholder(path: string, data: any): string {
  return path.split('.').reduce((obj, key) => obj?.[key], data) ?? ''
}

export function resolveValidatorImage(validator: string): string {
  return `https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/cosmos/moniker/${validator}.png`
}

export default function renderTemplate(
  template: string,
  data: Record<string, any>
): string {
  let rendered = template

  // Process markdown placeholders
  const markdownRegex = /{md%([\w.]+)%}/g
  rendered = rendered.replace(markdownRegex, (_, key) => {
    const markdownContent = resolvePlaceholder(key.trim(), data)
    return markdownContent
      ? marked(markdownContent, { async: false, breaks: true })
      : ''
  })

  // Process loops
  const loopRegex = /{% for (\w+) in (\w+) %}([\s\S]*?){% endfor %}/g
  rendered = rendered.replace(
    loopRegex,
    (_, itemVar, arrayVar, loopContent) => {
      const arrayData = data[arrayVar]
      if (Array.isArray(arrayData)) {
        return arrayData
          .map((item) =>
            renderTemplate(loopContent, { ...data, [itemVar]: item })
          )
          .join('')
      }
      return ''
    }
  )

  // Process standard placeholders
  const placeholderRegex = /{%([\w.]+)%}/g
  rendered = rendered.replace(
    placeholderRegex,
    (_, key) => resolvePlaceholder(key.trim(), data) || ''
  )

  return rendered
}

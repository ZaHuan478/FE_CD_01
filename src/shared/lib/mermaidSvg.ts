/** Only accepts the already sanitized output of Mermaid's strict renderer. */
export function prepareMermaidSvg(markup: string, radius = 10): string {
  // Mermaid's HTML labels may contain HTML void elements such as <br>.
  // Parse in an inert HTML document first, then serialize SVG/XHTML as XML.
  const parser = new DOMParser()
  const document = parser.parseFromString(markup, 'text/html')
  const svg = document.body.firstElementChild
  if (!svg || svg.localName !== 'svg' || svg.namespaceURI !== 'http://www.w3.org/2000/svg'
    || document.querySelector('parsererror')) {
    throw new Error('SVG lưu đồ không hợp lệ. Vui lòng thử dựng lại lưu đồ.')
  }
  for (const group of svg.querySelectorAll('g.node.task')) {
    // Do not change rectangles in nested labels or another node type.
    for (const rect of group.querySelectorAll(':scope > rect')) {
      rect.setAttribute('rx', String(radius))
      rect.setAttribute('ry', String(radius))
    }
  }
  const serialized = new XMLSerializer().serializeToString(svg)
  const verified = parser.parseFromString(serialized, 'image/svg+xml')
  if (verified.querySelector('parsererror') || verified.documentElement.localName !== 'svg') {
    throw new Error('Không thể xuất SVG hợp lệ cho lưu đồ này.')
  }
  return serialized
}

export function placeholderImage(text, size = '400x500') {
  return `https://placehold.co/${size}?text=${encodeURIComponent(text)}`
}

export function imageFallbackHandler(text, size) {
  return (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = placeholderImage(text, size)
  }
}

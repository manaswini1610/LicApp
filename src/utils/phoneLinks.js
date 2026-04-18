/**
 * Build tel: and WhatsApp (wa.me) URLs from stored phone strings.
 * Assumes India (+91) when the number is 10 digits (common for local entry).
 */
export function digitsOnly(phone) {
  if (phone == null || phone === '') return ''
  return String(phone).replace(/\D/g, '')
}

export function telHref(phone) {
  const d = digitsOnly(phone)
  return d ? `tel:${d}` : '#'
}

export function whatsAppHref(phone) {
  let d = digitsOnly(phone)
  if (d.length === 10) d = `91${d}`
  if (!d) return '#'
  return `https://wa.me/${d}`
}

export function hasDialablePhone(phone) {
  return digitsOnly(phone).length > 0
}

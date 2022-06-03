function normalizePhone(phone: string): string {
  return phone.replace(/\D+/g, '')
}

function validatePhone(phone: string) {
  if (phone.length != 11) {
    throw Error('incorrect numder format')
  }

  if (!phone.startsWith('79')) {
    throw Error('Номер должен быть вида +7 (9xx) xxx-xx-xx')
  }
}

export { normalizePhone, validatePhone }

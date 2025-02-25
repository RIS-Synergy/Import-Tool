export function parseTimeoutString(timeoutString: string) {
  const match = timeoutString.match(/(\d+)([smh])/)
  if (!match) {
    throw new Error('Invalid timeout string')
  }

  const value = parseInt(match[1])
  const unit = match[2]

  switch (unit) {
    case 's':
      return value
    case 'm':
      return value * 60
    case 'h':
      return value * 60 * 60
    default:
      throw new Error('Invalid timeout unit')
  }
}

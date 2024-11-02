import bcrypt from 'bcryptjs'

export function hash(plain: string) {
  return bcrypt.hashSync(plain, 12)
}

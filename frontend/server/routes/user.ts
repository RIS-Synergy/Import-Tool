import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { user } = jwt.decode(body.token)

  return {
    user
  }
})

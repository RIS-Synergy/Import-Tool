import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // console.log('body user nuxt api', body)

  const result = jwt.decode(body.token)

  // console.log('result user nuxt api', result)

  return {
    user: result.user // || {}
  }
})

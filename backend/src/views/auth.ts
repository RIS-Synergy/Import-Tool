import express, { Router, Request, Response } from "express"

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from '../utils/errors.js'

import { PrismaClient } from '@prisma/client'
import auth from '../middleware/auth.js'
import { login } from './validators.js'
import validator from '../middleware/validator.js'

export const prisma = new PrismaClient()
import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'view:auth' });

const router: Router = express.Router()

router.post('/login', validator(login), async (req: Request, res: Response) => {
  const { username, password } = req.body

  log.info(`🧑 Login attempt for user: ${username}`)

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  log.info(user)

  if (!user) {
    throw new AuthenticationError()
  }
  const validPass = bcrypt.compareSync(password, user.password || 'nope!')
  if (!validPass) {
    throw new AuthenticationError()
  }

  const userDisplay = {
    username: user.username,
    permission: user.permission,
    ri: user.researchInstitutionId
  }
  const token = {
    user: {
      id: user.id,
      ...userDisplay
    }
  }
  const tokenSigned = jwt.sign(token, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  res.json({
    token: tokenSigned,
    user: userDisplay
  })
})

// refresh token
router.get('/refresh', auth, async (req: Request, res: Response) => {
  // const { token } = req.body
  // log.info('req: /auth/refresh', req.headers)
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const { exp } = decodedToken
  delete decodedToken.iat
  delete decodedToken.exp
  // log.info('decodedToken', decodedToken)
  const newToken = jwt.sign(decodedToken, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  const decodedTokenNew = jwt.verify(newToken, process.env.JWT_SECRET)
  // JWT expiration difference delta
  log.debug('JWT refresh', decodedTokenNew.exp - exp)
  res.json({
    token: newToken
  })
})

router.post('/sso-login', async (req: Request, res: Response) => {
  const { token } = req.body

  log.info(`🧑 SSO login attempt`)

  if (!token) {
    return res.status(400).json({ error: "Missing token" })
  }

  try {
    let username: string
    let email: string = ''

    if (typeof token === 'string' && token.startsWith('mock-')) {
      username = token.replace('mock-', '')
      email = `${username}@example.com`
      log.info(`Mock SSO bypass for user: ${username}`)
    } else {
      const keycloakBaseUrl = process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL || 'http://localhost:8080/realms/importtool'
      const userinfoUrl = `${keycloakBaseUrl}/protocol/openid-connect/userinfo`

      log.info(`Verifying token with Keycloak at: ${userinfoUrl}`)
      const userinfoResponse = await fetch(userinfoUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!userinfoResponse.ok) {
        log.error(`Keycloak userinfo request failed with status: ${userinfoResponse.status}`)
        throw new AuthenticationError()
      }

      const userInfo: any = await userinfoResponse.json()
      log.info(`Received user profile from Keycloak SSO:\n${JSON.stringify(userInfo, null, 2)}`)
      username = userInfo.preferred_username || userInfo.username || userInfo.email
      email = userInfo.email || ''

      if (!username) {
        log.error('Keycloak userinfo response did not contain username, preferred_username or email', userInfo)
        throw new AuthenticationError()
      }
    }

    log.info(`SSO verified username: ${username}`)

    // Find user in database, or create one if they don't exist
    let user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      log.info(`User ${username} not found in database. Creating default user.`)
      const firstRi = await prisma.researchInstitution.findFirst()
      user = await prisma.user.create({
        data: {
          username,
          email: email || `${username}@example.com`,
          permission: ['edit'],
          researchInstitutionId: firstRi ? firstRi.id : null
        }
      })
    }

    const userDisplay = {
      username: user.username,
      permission: user.permission,
      ri: user.researchInstitutionId
    }
    const appToken = {
      user: {
        id: user.id,
        ...userDisplay
      }
    }
    const tokenSigned = jwt.sign(appToken, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.json({
      token: tokenSigned,
      user: userDisplay
    })
  } catch (error) {
    log.error('SSO login error:', error)
    return res.status(401).json({ error: "Invalid SSO credentials" })
  }
})

export default router

// update password
router.post('/password', async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body

  const username = jwt.decode(req.headers.authorization.split(' ')[1]).user.username
  // if the passwords match, update prisma
  // if not, return an error

  const user = await prisma.user.update({
    where: {
      username
    },
    data: {
      password: bcrypt.hashSync(newPassword, 8)
    }
  })

  res.json({ success: true })
})

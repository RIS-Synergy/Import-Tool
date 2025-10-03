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

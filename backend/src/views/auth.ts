import express, { Router, Request, Response } from "express"

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from '../utils/errors'

import { PrismaClient } from '@prisma/client'
import { login } from './validators'
import validator from '../middleware/validator'

export const prisma = new PrismaClient()
import { Logger } from "tslog";
const log = new Logger({ name: 'view:auth' });

const router: Router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  log.info('req: /auth')
  return res.json({})
})

router.get('/session', async (req: Request, res: Response) => {
  log.info('req: /auth/session')
  return res.json({})
})

router.get('/providers', async (req: Request, res: Response) => {
  log.info('req: /auth/providers')
  return res.json({})
})

router.get('/signin', async (req: Request, res: Response) => {
  log.info('req: /auth/signin')
  return res.json({})
})

router.post('/login', validator(login), async (req: Request, res: Response) => {
  const { username, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if (!user) {
    throw new AuthenticationError()
  }
  const validPass = bcrypt.compareSync(password, user.password || 'nope!')
  if (!validPass) {
    throw new AuthenticationError()
  }
  const token = {
    user: {
      username: user.username,
      id: user.id
    }
  }
  const tokenSigned = jwt.sign(token, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  res.json({
    token: tokenSigned,
    user: {
      username: user.username,
    }
  })
})

export default router

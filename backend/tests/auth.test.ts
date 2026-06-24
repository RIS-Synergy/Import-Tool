import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// Mock prisma client
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    researchInstitution: {
      findFirst: vi.fn(),
    }
  }
  return {
    PrismaClient: vi.fn(() => mockPrisma)
  }
})

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

import router, { prisma } from '../src/views/auth.js'

describe('SSO Authentication Route', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    vi.clearAllMocks()
    mockRequest = {}
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    process.env.JWT_SECRET = 'testsecret'
    process.env.JWT_EXPIRES_IN = '1h'
  })

  it('should reject requests without a token', async () => {
    mockRequest.body = {}
    const ssoRoute = router.stack.find((s) => s.route && s.route.path === '/sso-login')
    expect(ssoRoute).toBeDefined()

    await ssoRoute.route.stack[0].handle(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Missing token' })
  })

  it('should accept mock-username bypass token and find/return existing user', async () => {
    mockRequest.body = { token: 'mock-johndoe' }
    const ssoRoute = router.stack.find((s) => s.route && s.route.path === '/sso-login')

    const mockUser = {
      id: 123,
      username: 'johndoe',
      permission: ['edit'],
      researchInstitutionId: 456
    }
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

    await ssoRoute.route.stack[0].handle(mockRequest as Request, mockResponse as Response)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'johndoe' } })
    expect(mockResponse.json).toHaveBeenCalled()
    const responseData = vi.mocked(mockResponse.json).mock.calls[0][0]
    expect(responseData.user.username).toBe('johndoe')
    expect(responseData.token).toBeDefined()

    const decoded: any = jwt.verify(responseData.token, 'testsecret')
    expect(decoded.user.username).toBe('johndoe')
  })

  it('should create user if username does not exist', async () => {
    mockRequest.body = { token: 'mock-newuser' }
    const ssoRoute = router.stack.find((s) => s.route && s.route.path === '/sso-login')

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.researchInstitution.findFirst).mockResolvedValue({ id: 999 } as any)

    const createdUser = {
      id: 777,
      username: 'newuser',
      permission: ['edit'],
      researchInstitutionId: 999
    }
    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any)

    await ssoRoute.route.stack[0].handle(mockRequest as Request, mockResponse as Response)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'newuser' } })
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'newuser',
        email: 'newuser@example.com',
        permission: ['edit'],
        researchInstitutionId: 999
      }
    })
    expect(mockResponse.json).toHaveBeenCalled()
  })
})

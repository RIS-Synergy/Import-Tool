import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { User } from '@prisma/client';
import { UserService } from './user.service.js';
import prisma from '@/lib/prisma.js';

vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    }
  };

  return { default: mockPrisma };
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  it('should find all users', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        email: 'alice@example.com',
        username: 'alice',
        password: 'Wonderland!',
      }
    ];

    (prisma.user.findMany as Mock).mockResolvedValue(mockUsers);

    const users = await userService.findAll();

    expect(users).toEqual(mockUsers);
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('should find a user by id', async () => {
    const mockUser = { id: 1, email: 'alice@example.com', username: 'alice', password: 'Wonderland!' };
    (prisma.user.findUnique as Mock).mockResolvedValue(mockUser);

    const user = await userService.findById(1);

    expect(user).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should create a new user', async () => {
    const newUserInput = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    };

    const expectedCreatedUser = {
      id: 1,
      ...newUserInput
    };

    (prisma.user.create as Mock).mockResolvedValue(expectedCreatedUser);

    const user = await userService.create(newUserInput);

    expect(user).toEqual(expectedCreatedUser);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: newUserInput,
    });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });
});

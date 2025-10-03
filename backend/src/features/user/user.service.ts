import prisma from '../../lib/prisma.js';

import { User } from './user.model.js';

type UserCreationParams = Omit<User, 'id'>;

type UserWithoutPassword = Omit<User, 'password'>;

export class UserService {
  public async findAll(): Promise<UserWithoutPassword[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        researchInstitution: true,
        permission: true
        // Exclude password by not selecting it
      },
    });
  }

  public async findMany(where: any): Promise<UserWithoutPassword[]> {
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        researchInstitution: true,
        permission: true
        // Exclude password by not selecting it
      },
    });
  }

  public async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async create(userData: UserCreationParams): Promise<User> {
    return prisma.user.create({
      data: userData,
    });
  }
}

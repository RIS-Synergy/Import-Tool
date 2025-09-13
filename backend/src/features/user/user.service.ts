import prisma from '@/lib/prisma';

import { User } from './user.model';

type UserCreationParams = Omit<User, 'id'>;

export class UserService {
  public async findAll(): Promise<User[]> {
    return prisma.user.findMany();
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

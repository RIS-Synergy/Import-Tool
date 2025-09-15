import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { Request, Response } from 'express';
import { User } from './user.model.js';

vi.mock('./user.service', () => {
  const mockUserService = {};
  return { UserService: vi.fn(() => mockUserService) };
});

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
    };

    (UserService as Mock).mockImplementation(() => mockUserService);

    userController = new UserController();
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('getAllUsers should return users with a 200 status', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        email: 'alice@example.com',
        username: 'alice',
        password: 'Wonderland!',
      }
    ];
    mockUserService.findAll.mockResolvedValue(mockUsers);

    await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

    expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
  });

  it('createUser should return the new user with a 201 status', async () => {
    const newUserInput = { name: 'Bob', email: 'b@b.com' };
    const createdUser: User = {
      id: 1,
      email: 'alice@example.com',
      username: 'alice',
      password: 'Wonderland!',
    };
    mockRequest.body = newUserInput;
    mockUserService.create.mockResolvedValue(createdUser);

    await userController.createUser(mockRequest as Request, mockResponse as Response);

    expect(mockUserService.create).toHaveBeenCalledWith(newUserInput);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
  });

  describe('getUserById', () => {
    it('should return a user with a 200 status', async () => {
      const mockUser = { id: 1, email: 'alice@example.com', username: 'alice', password: 'Wonderland!' };
      mockRequest.params = { id: '1' };
      mockUserService.findById.mockResolvedValue(mockUser);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return a 404 status if user is not found', async () => {
      mockRequest.params = { id: '99' };
      mockUserService.findById.mockResolvedValue(null);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findById).toHaveBeenCalledWith(99);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User with id 99 not found.' });
    });

    it('should return a 500 status on error', async () => {
      mockRequest.params = { id: '1' };
      mockUserService.findById.mockRejectedValue(new Error('DB Error'));

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving user' });
    });
  });

  describe('error handling', () => {
    // Test error handling for getAllUsers
    it('getAllUsers should return 500 on error', async () => {
      mockUserService.findAll.mockRejectedValue(new Error('Something went wrong'));

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving users' });
    });

    // Test error handling for createUser
    it('createUser should return 500 on error', async () => {
      const newUserInput = { name: 'Bob', email: 'b@b.com' };
      mockRequest.body = newUserInput;
      mockUserService.create.mockRejectedValue(new Error('Failed to create'));

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating user' });
    });
  })
});

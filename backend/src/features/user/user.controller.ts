import { Request, Response } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  private readonly userService = new UserService();

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    let where = {};
    if (!req.user.permission.includes('admin')) {
      // If not admin, only show users from the same research institution
      where = {
        researchInstitutionId: req.user.ri
      };
    }

    try {
      const users = await this.userService.findMany(where);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users' });
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await this.userService.findById(id);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `User with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user' });
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await this.userService.create(req.body);
      res.status(201).json(newUser); // 201 Created
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  };
}

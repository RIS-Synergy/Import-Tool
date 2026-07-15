import { Request, Response } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  private readonly userService = new UserService();

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    let where = {};
    const permissions = req.user.permission || []
    if (!permissions.includes('superuser')) {
      // If not superuser, only show users from the same research institution
      where = {
        researchInstitutionId: req.user.ri
      }
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

  public updatePermission = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const newPermissions: string[] = req.body.permission;
      const callerPermissions = req.user.permission || [];

      if (!callerPermissions.includes('admin') && !callerPermissions.includes('superuser')) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const targetUser = await this.userService.findById(id);
      if (!targetUser) {
        res.status(404).json({ message: `User with id ${id} not found.` });
        return;
      }

      if (callerPermissions.includes('admin') && !callerPermissions.includes('superuser')) {
        if (targetUser.researchInstitutionId !== req.user.ri) {
          res.status(403).json({ message: 'Forbidden: Cannot edit user from another Research Institution.' });
          return;
        }
        if (newPermissions.includes('superuser')) {
           res.status(403).json({ message: 'Forbidden: Only superusers can grant superuser permission.' });
           return;
        }
      }

      const updatedUser = await this.userService.updatePermission(id, newPermissions);
      // Remove password before sending
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user permissions' });
    }
  };
}

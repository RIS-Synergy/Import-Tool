import { Router } from 'express';
import { UserController } from './user.controller.js';
import { createUserSchema, userIdSchema, updatePermissionSchema } from './user.validation.js';
import { validate } from '@/middleware/validator.js'

const router = Router();
const userController = new UserController();

router.get('/',
           userController.getAllUsers);

router.post('/',
            validate(createUserSchema, "body"),
            userController.createUser);

router.get('/:id',
           validate(userIdSchema, "params"),
           userController.getUserById);

router.patch('/:id/permission',
             validate(userIdSchema, "params"),
             validate(updatePermissionSchema, "body"),
             userController.updatePermission);

export default router;

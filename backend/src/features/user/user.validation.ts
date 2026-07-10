import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().optional(),
});

export const userIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

export const updatePermissionSchema = Joi.object({
  permission: Joi.array().items(Joi.string().valid('edit', 'admin', 'superuser')).required(),
});

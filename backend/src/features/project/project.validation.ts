import Joi from 'joi';

export const projectIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

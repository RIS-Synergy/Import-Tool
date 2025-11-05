import Joi from 'joi';

export const oefosIdSchema = Joi.object({
  id: Joi.string().required()
});

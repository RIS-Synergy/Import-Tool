import Joi from 'joi';

export const uploadSchema = Joi.object({
  templateId: Joi.number().integer().min(1).required(),
  ris: Joi.any().required(),
  settings: Joi.object().required(),
});

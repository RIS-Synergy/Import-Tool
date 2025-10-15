import Joi from 'joi';

export const createCRISSchema = Joi.object({
  name: Joi.string().required(),
  apiUrl: Joi.string().uri().required(),
  researchInstitutionId: Joi.number().integer().min(1).required(),
  data: Joi.object().default({}),
});

export const crisIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

export const searchSchema = Joi.object({
  query: Joi.string().required(),
  crisId: Joi.number().integer().min(1).optional(),
  entityTypes: Joi.array().items(Joi.string())
});

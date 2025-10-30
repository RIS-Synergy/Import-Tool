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

export const referenceSchema = Joi.object({
  crisId: Joi.number().integer().min(1).required(),
  systemName: Joi.string().required(),
  uuid: Joi.string().required(),
});

export const uploadSchema = Joi.object({
  crisId: Joi.number().integer().min(1).required(),
  ris: Joi.object().required(),
  settings: Joi.object().required(),
  uuid: Joi.string().allow(null).required(),
  templateId: Joi.number().integer().min(1).required(),
  entity: Joi.string().valid('project', 'application', 'award').required(),
});

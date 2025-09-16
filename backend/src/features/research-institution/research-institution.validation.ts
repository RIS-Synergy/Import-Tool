import Joi from 'joi';

export const createResearchInstitutionSchema = Joi.object({
  name: Joi.string().required(),
  domain: Joi.string().domain().required(),
  rorId: Joi.string().required(),
});

export const researchInstitutionIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

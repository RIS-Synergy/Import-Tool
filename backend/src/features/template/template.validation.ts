import Joi from 'joi';

export const createTemplateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().default(''),
  templateType: Joi.string().valid('project', 'application', 'award').required(),
  yamlTemplate: Joi.string().default('output:\n')
});

export const updateTemplateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  templateType: Joi.string().valid('project', 'application', 'award'),
  yamlTemplate: Joi.string()
});

// Just an id "param"
export const templateIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

// get('/:type',
export const templateTypeSchema = Joi.object({
  type: Joi.string().valid('project', 'application', 'award').required()
});

export const getIdAndType = Joi.object({
  id: Joi.number().integer().min(1).required(),
  type: Joi.string().valid('project', 'application', 'award').required()
});

// ok
export const verifyTemplateSchema = Joi.object({
  yamlTemplate: Joi.string().required()
});

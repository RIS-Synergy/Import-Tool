import Joi from 'joi';

export const createFundingAgencySchema = Joi.object({
  id: Joi.string().required(),
  clientSecret: Joi.string().optional(),
  clientId: Joi.string().optional(),
  data: Joi.object().default({}),
});

export const fundingAgencyIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const fundingAgencyUpdateSchema = Joi.object({
  clientSecret: Joi.string().optional(),
  clientId: Joi.string().optional(),
});

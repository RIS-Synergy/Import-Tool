import Joi from 'joi';

export const functionNameSchema = Joi.object({
    name: Joi.string().required(),
});

export const functionCreateOrUpdateSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    language: Joi.string().default('javascript'),
});

export const functionVerifySchema = Joi.object({
    code: Joi.string().required(),
    input: Joi.object().default({}),
    settings: Joi.object().default({}),
});

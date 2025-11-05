import Joi from 'joi';

export const functionNameSchema = Joi.object({
    name: Joi.string().required(),
});

export const functionCreateSchema = Joi.object({
    name: Joi.string().required(),
});

export const functionUpdateSchema = Joi.object({
    code: Joi.string().required(),
    language: Joi.string().default('javascript'),
    description: Joi.string().default(''),
});

export const functionVerifySchema = Joi.object({
    code: Joi.string().required(),
    input: Joi.object().default({}),
    settings: Joi.object().default({}),
});

import Joi from 'joi'

function makeSchema(params: object) {
  return Joi.object(params)
}

export const login = makeSchema({
  username: Joi.string().required(),
  password: Joi.string().required()
})

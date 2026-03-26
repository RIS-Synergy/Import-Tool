import Joi from 'joi'

function makeSchema(params: object) {
  return Joi.object(params)
}

export const login = makeSchema({
  username: Joi.string().required(),
  password: Joi.string().required()
})

export const filter = makeSchema({
  page: Joi.number().integer(),
  sortBy: Joi.array().items(Joi.object({
    key: Joi.string(),
    order: Joi.string().valid("asc", "desc")
  })),
  filters: Joi.object({
    status: Joi.array().items(Joi.string()),
    piDomain: Joi.object({
      domain: Joi.string(),
      ror: Joi.string()
    }),
    diffs: Joi.string()
      .valid("All", "NULL", "IDENTICAL", "DIFFERENT", "SYNCED"),
    orderBy: Joi.string(),
    itemsPerPage: Joi.number().integer()
  })
})

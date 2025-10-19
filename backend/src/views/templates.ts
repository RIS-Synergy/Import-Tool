import express, { Router, Request, Response } from "express"
import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'view:templates'});
const router: Router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import yaml from 'js-yaml'

const typeMap = {
  project: 'PROJECT',
  application: 'APPLICATION',
  award: 'AWARD'
}

router.post('/', async (req: Request, res: Response) => {
  // create a new template
  log.info('create or update template')
  const { name, description, templateId, templateType } = req.body

  var result = null
  if (!templateId) {
    // create
    result = await prisma.template.create({
      data: {
        name,
        description,
        templateType: typeMap[templateType],
        yamlTemplate: 'output:\n'
      }
    })
  } else {
    // update
    result = await prisma.template.update({
      where: {
        id: Number(templateId)
      },
      data: {
        name,
        description,
        templateType: typeMap[templateType],
      }
    })
  }

  // const result = await prisma.template.create({
  //   data: {
  //     name,
  //     description,
  //     templateType: typeMap[templateType],
  //     yamlTemplate: 'output:\n'
  //   }
  // })
  // const result = await prisma.template.upsert({
  //   where: templateId && {
  //     id: templateId
  //   } || null,
  //   update: {
  //     name,
  //     description,
  //     templateType: typeMap[templateType],
  //   },
  //   create: {
  //     name,
  //     description,
  //     templateType: typeMap[templateType],
  //     yamlTemplate: 'output:\n'
  //   }
  // })

  res.json(result)
})

router.put('/:id', async (req: Request, res: Response) => {
  // update a template
  log.info('update template')
  const { text } = req.body
  const { id } = req.params


  log.info('text', text)
  // var textYaml = yaml.dump(text, { indent: 2, lineWidth: -1 })

  // replace any following visible signes
  const textYaml = text.replace(/\n$/gm, '');

  // remove any \w at the end of the line
  // textYaml = textYaml.replace(/\\w/g, '')

  log.info('yaml', textYaml)
  const result = await prisma.template.update({
    where: {
      id: Number(id)
    },
    data: {
      yamlTemplate: textYaml
    }
  })

  res.json({
    ...result,
    yamlTemplate: text.replace(/\\n/g, '')
  })
})

router.get('/:type', async (req: Request, res: Response) => {
  const templateType = typeMap[req.params.type]

  if(!templateType) {
    res.json({
      error: `Template type ${req.params.type} not found`
    })
    return
  }

  const result = await prisma.template.findMany({
    // set the type
    where: {
      templateType: typeMap[req.params.type]
    },
    orderBy: {
      modifiedDate: 'desc'
    }
  })

  log.info(`get ${result.length} template, ${req.params.type}`, `(${templateType})`)
  res.json(result)
})

router.get('/:type/:id', async (req: Request, res: Response) => {
  log.info('get template', req.params.id)
  const result = await prisma.template.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  // add yaml
  // result.jsonTemplate = yaml.load(result.yamlTemplate)

  res.json({
    ...result,
    // jsonTemplate: yaml.load(result.yamlTemplate)
  })
})

router.post('/verify', async (req: Request, res: Response) => {
  // log.info('verify template')
  const { text } = req.body
  log.debug('====== text ======\n', text, '\n====== text ended ======')
  var result

  try {
    result = yaml.load(text)
    log.info('yaml is OK')
  } catch (e) {
    log.error('yaml error', e)
    res.json({
      error: e
    })
    return
  }

  // log.debug('json', result)
  res.json(result)
})

export default router

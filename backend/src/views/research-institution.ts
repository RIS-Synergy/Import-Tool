import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { callRIApi } from '../utils/ri-api'
import { projectETL2, projectETL2cluster } from '../ris-pure-etl/index'
import { uploadProjectApplicationClusters } from '../ris-pure-etl/clusters'

import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri' });

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Project } from '../models/Project'

const router: Router = express.Router()

router.get('/project/:id', async (req: Request, res: Response) => {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 10,
    offset: 0,
    searchString: req.params.id
  })

  if (!result.items || result.items.length === 0) {
    res.json({
      error: `Research Institution could not find ${req.params.id}`,
      uuid: null
    })
    return
  }

  const item = result.items[0]
  const { uuid } = item
  res.json({
    count: result.count,
    item,
    uuid
  })
})

/**
@deprecated
**/
router.get('/search', async (req: Request, res: Response) => {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 100,
    offset: 0,
    searchString: "10.55776/", // FWF id
  })
  res.json(result)
})

async function updateCrisId(risId: string, resultData: any, settings: any, template: any) {
  log.info('Updating project', risId, 'with pureId', resultData.pureId)

  log.info('template', template)
  log.info('settings', settings)


  let saveData = resultData
  log.info('SaveData', saveData)

  const result = await prisma.project.update({
    where: {
      risId,
    },
    data: {
      crisId: String(resultData.pureId),
      crisUUID: resultData.uuid,

      savedTemplate: {
        create: {
          template,
          settings,
          saveData
        }
      }
    }
  })
  log.debug('Updated Project database', result.id)
}

router.post('/upload', async (req: Request, res: Response) => {
  const { ris, settings, uuid, template: templateId } = req.body

  const template = await prisma.template.findUnique({
    where: {
      id: templateId.projectId
    }
  })
  log.debug('Template', template.id, template.name)

  const pure = await projectETL2(template.yamlTemplate, ris, settings)

  if (uuid) {
    const result = await callRIApi(`/projects/${uuid}`, 'PUT', pure)
    if (result.error) {
      return res.json(result)
    }
    log.info('Update project', result.uuid)
    const project = new Project(ris.id)
    project.createOrUpdateCrisLink(result)
    // XXX pause Applications and Awards for now
    // await uploadProjectApplicationClusters(result)
    // await updateCrisId(ris.id, result, settings, req.body.template)
    return res.json(result)
  } else {
    const result = await callRIApi('/projects', 'PUT', pure)
    if (result.error) {
      return res.json(result)
    }
    log.info('Created new project', result)
    const project = new Project(ris.id)
    project.createOrUpdateCrisLink(result)
    // XXX pause Applications and Awards for now
    // await uploadProjectApplicationClusters(result)
    // await updateCrisId(ris.id, result, settings, req.body.template)
    return res.json(result)
  }
})

router.get('/organizations/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/organizations/${req.params.id}`, 'GET')
  res.json(result)
})

router.get('/persons/:id', async (req: Request, res: Response) => {
  // if (process.env.RIS_USE_DEV) {
  //   return res.json({})
  // } else {
  const result = await callRIApi(`/persons/${req.params.id}`, 'GET')
  res.json(result)
  // }
})

router.get('/reference/:systemName/:uuid', async (req: Request, res: Response) => {
  const systemNameMapping = {
    'Organization': 'organizations',
    'User': 'users'
  }

  const result = await callRIApi(`/${systemNameMapping[req.params.systemName]}/${req.params.uuid}`, 'GET')
  log.debug('Reference', req.params.systemName, 'received')
  res.json(result)
})

router.post('/search', async (req: Request, res: Response) => {
  // if development, don't call the CRIS API
  // if (process.env.RIS_USE_DEV) {
  //   return res.json({})
  // }

  const entities = {
    persons: [
      {
        name: 'persons',
        // lookup: [ 'staffOrganizationAssociations', 'user' ]
      },
      {
        name: 'external-persons',
        lookup: 'externalOrganizations'
      }
    ],

    // we have not used these yet
    organizations: [
      {
        name: 'organizations'
        // lookup: 'organizations'
      },
      {
        name: 'external-organizations',
        // lookup: 'externalOrganizations'
      }],
  }

  var results = []

  for (const entity of entities[req.body.entity]) {
    const result = await callRIApi(`/${entity.name}/search`, 'POST', {
      size: 10,
      offset: 0,
      searchString: req.body.searchString
    })

    // log.info(`Number of "${entity.name}" users:`, results.length)

    result.items.map((item: any) => {
      results.push({
        pureId: item.pureId,
        uuid: item.uuid,
        name: item.name.firstName + ' ' + item.name.lastName,
        user: item.user && item.user.uuid,
        details: item,
        entity,
        systemName: item.systemName,
      })
    })
  }

  res.json(results)
})

async function getProjectClusters(type: string, uuid: string) {
  if (type !== 'AwardManagementProject') return

  const clusters = await Promise.all([
    callRIApi(`/projects/${uuid}/application-clusters`, 'GET'),
    callRIApi(`/projects/${uuid}/award-clusters`, 'GET'),
  ])
  console.log('clusters', clusters)
  return {
    applicationClusters: clusters[0].items,
    awardClusters: clusters[1].items
  }
}

// GET for any concept with id or uuid
router.get('/:concepts/:uuid', async (req: Request, res: Response) => {
  const { concepts, uuid } = req.params
  if (uuid.match(/^\d+$/)) {
    // if it's numnber, search
    const { items, count } = await callRIApi(`/${concepts}/search`, 'POST', {
      size: 10,
      offset: 0,
      searchString: uuid
    })
    if (count === 0) {
      res.json({
        error: `Research Institution could not find ${req.params.id}`,
        uuid: null
      })
      return
    } else if (count === 1) {
      console.log('we have a match')
      const item = items[0]
      console.log(await getProjectClusters(item.typeDiscriminator, item.uuid))
      res.json(item)
    } else {
      console.log('we have multiple matches', items)
      // find a matched pureId
      const item = items.find((item: any) => item.pureId === uuid)
      if (item) {
        res.json(item)
      } else {
        res.json({
          error: `Research Institution could not find ${uuid}`,
          uuid: null
        })
      }
    }
  } else {
    // if it's a uuid
    console.log('uuid', uuid)

    const result = await callRIApi(`/${concepts}/${uuid}`, 'GET')
    res.json(result)
  }
})

// PUT for any concept with uuid
router.put('/:concepts/:uuid', async (req: Request, res: Response) => {
  const result = await callRIApi(`/${req.params.concepts}/${req.params.uuid}`, 'PUT', req.body)
  res.json(result)
})

export default router

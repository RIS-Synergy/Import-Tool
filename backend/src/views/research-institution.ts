import express, { Router, Request, Response } from "express"

import { callRIApi } from '../utils/ri-api.js'

import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'view:ri' });

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { ResearchInstitution } from "../models/ResearchInstitution.js"
import { Transform } from '../models/Transform.js'

const router: Router = express.Router()

const ri = new ResearchInstitution()

router.post('/searchAny', async (req: any, res: any) => {
  // TODO there is a class for this already in ResearchInstitution.searchCategories
  const entityTypes = [
    'projects',
    'applications',
    'awards',
    'persons',
    'external-persons',
  ]
  const { searchString } = req.body
  var results = []

  const promises = entityTypes.map(entityType => {
    var result
    try {
      result = callRIApi(`/${entityType}/search`, 'POST', {
        size: 10,
        offset: 0,
        searchString
      }).then((result: any) => {
        result.items.map((item: any) => {
          results.push({
            pureId: item.pureId,
            uuid: item.uuid,
            name: item.name,
            title: item.title,
            entity: entityType,
            modifiedDate: item.modifiedDate,
          });
        })
      })
    } catch {
      log.error('Error searching', entityType)
      return
    }
    return result
  })


  await Promise.all(promises);

  // order by item.modifiedDate
  const sortedResults = results.sort((a, b) => {
    return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime();
  });

  return res.json(sortedResults);
})

router.post('/searchCluster', async (req: any, res: any) => {
  const { searchString, uuid } = req.body
  const entityType = req.body.entityType

  const result = await callRIApi(`/${entityType}/search`, 'POST', {
    size: 100,
    offset: 0,
    searchString
  })
  const item = result.items[0]

  // find uniqie list of items, that have x.cluster.uuid that is the same as the searchString
  if (item.cluster && item.cluster.uuid === uuid) {
    return res.json(result.items[0])
  }

  return res.json(result.items)
})

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

// @ts-none
router.post('/upload', async (req: any, res: any) => {
  const { ris, settings, uuid, template: templateId, entity } = req.body;

  log.info('Upload request', uuid, templateId, entity);

  if (!ris || !settings || !templateId || !entity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const template = await prisma.template.findUnique({
    where: { id: templateId[`${entity}Id`] }
  });
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  log.info('Template', template.id, template.name);
  const transform = new Transform()
  const templateResult = await transform.run(template.yamlTemplate, ris, settings)

  log.debug('Template Result', templateResult.output);
  var result = null
  if (uuid) {
    result = await ri.uploadEntity(entity, templateResult.output, uuid);
    ri.addNote(entity, uuid);
  } else {
    result = await ri.createEntity(entity, templateResult.output);
    ri.addNote(entity, result.uuid);
  }

  return res.json(result);
});

router.get('/organizations/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/organizations/${req.params.id}`, 'GET')
  res.json(result)
})

router.get('/persons/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/persons/${req.params.id}`, 'GET')
  res.json(result)
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
  const entities = {
    persons: [
      {
        name: 'persons',
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
      },
      {
        name: 'external-organizations',
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
    result && result.items && result.items.map((item: any) => {
      results.push({
        pureId: item.pureId,
        uuid: item.uuid,
        name: item.name && item.name.firstName + ' ' + item.name.lastName,
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

    const result = await ri.callApi(`/${concepts}/${uuid}`, 'GET')
    res.json(result)
  }
})

router.post('/assignCluster', async (req: Request, res: Response) => {
  console.log('assignCluster', req.body)

  const { projectUUID, uuid, systemName } = req.body
  const entity = systemName.toLowerCase() + 's'
  const entityData = await ri.callApi(`/${entity}/${uuid}`, 'GET')
  const clusterUUID = entityData.cluster.uuid
  console.log('clusterUUID', clusterUUID)

  // const project = await ri.getProjectData(req.body.projectUUID)
  const project = await ri.getEntityData('Project', req.body.projectUUID)
  project[`${systemName.toLowerCase()}Clusters`] = [
    {
      uuid: clusterUUID,
      systemName: systemName + 'Cluster',
    }
  ]

  console.log('project', project)

  const result = await ri.callApi(`/projects/${projectUUID}`, 'PUT', project)

  res.json(result)
})

export default router

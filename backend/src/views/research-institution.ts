import express, { Router, Request, Response } from "express"

import { callRIApi } from '../utils/ri-api'
import { projectETL2 } from '../ris-pure-etl/index'
import { uploadProjectApplicationClusters } from '../ris-pure-etl/clusters'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri' });

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Project } from '../models/Project'
import { ResearchInstitution } from "../models/ResearchInstitution"

const router: Router = express.Router()

const ri = new ResearchInstitution()

router.post('/searchAny', async (req: Request, res: Response) => {
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

  const promises = entityTypes.map(entityType =>
    callRIApi(`/${entityType}/search`, 'POST', {
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
      });
    })
  );

  await Promise.all(promises);

  // order by item.modifiedDate
  const sortedResults = results.sort((a, b) => {
    return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime();
  });

  return res.json(sortedResults);
})

router.post('/searchCluster', async (req: Request, res: Response) => {
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

async function updateCrisId(risId: string, resultData: any, settings: any, template: any) {
  // TODO not project, but 'entity'
  log.info('Updating project', risId, 'with pureId', resultData.pureId)

  log.info('template', template)
  log.info('settings', settings)

  let saveData = resultData

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

async function createOrUpdateProject(uuid: string | undefined, pure: any, risId: string, templateId: any, ris: any, settings: any, entity: string) {
  const apiEndpoint = uuid ? `/${entity}s` : `/${entity}s/${uuid}`;
  const method = 'PUT';
  let result = await callRIApi(apiEndpoint, method, pure);

  if (result.error) {
    return result;
  }

  log.info(!uuid ? `Created new ${entity}` : `Updated ${entity}`, result);
  // const project = new Project(risId);
  // project.createOrUpdateCrisLink(result);
  // const proj = await uploadProjectApplicationClusters(result, templateId, ris, settings);

  // save into the database
  await updateCrisId(risId, result, settings, templateId);

  // add note
  const source = 'FWF'
  const prefix = uuid ? 'Updated' : 'Created';
  await ri.addNote({
    entity,
    uuid: result.uuid,
    username: 'RIS-Synergy API',
    text: prefix + ` on ${new Date().toISOString().split('T')[0]}.

Source: ${source}.`
  })

  // log.info('XXXXXXXXXXXXXX', proj, result)
  log.info('XXXXXXXXXXXXXX', result)

  // result = await callRIApi(apiEndpoint, method, pure);
  return result;
}

router.post('/upload', async (req: Request, res: Response) => {
  const { ris, settings, uuid, template: templateId, entity } = req.body;

  log.info('Upload request', uuid, templateId, entity);

  if (!ris || !settings || !templateId || !entity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId[`${entity}Id`] }
    });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    log.debug('Template', template.id, template.name);
    const pure = await projectETL2(template.yamlTemplate, ris, settings);
    log.debug('Pure data', pure);
    // return res.json({ pause: true }) // XXX just for debugging

    const result = await createOrUpdateProject(uuid, pure, ris.id, templateId, ris, settings, entity);

    return res.json(result);
  } catch (error) {
    log.error('Error processing upload', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
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

router.get('/:concepts/:uuid', async (req: Request, res: Response) => {
  const result = await callRIApi(`/${req.params.concepts}/${req.params.uuid}`, 'GET')
  res.json(result)
})

export default router

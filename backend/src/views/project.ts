import express, { Router, Request, Response } from "express"
import { Logger } from "tslog";
const log = new Logger({ name: 'view:project'});
// const fs = require('fs')
const router: any = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import multer from 'multer'
const upload = multer();

async function useProject (project): Promise<any> {
  log.debug('Project', project.id)

  const { id } = project
  const unique = await prisma.project.findUnique({
    where: {
      risId: id
    }
  })

  if (unique) {
    log.warn('Project already exists. Skipping.', project.id)
    return { id: project.id, skipped: true }
  }

  const created = await prisma.project.create({
    data: {
      risId: project.id,
      risData: project
    }
  })

  log.info('Project created', project.id)
  return { id: project.id, created: true }
}

// Upload multiple projects as FormData and save to prisma
router.post('/upload', upload.array ('files'), async (req, res) => {
  var results: Array<any> = []
  const files: any = req.files
  const bla = files.forEach(async (file) => {
    const fileName = file.originalname
    const buffer: Buffer = file.buffer
    const jsonString: string = buffer.toString('utf-8');
    const jsonObject = JSON.parse(jsonString);

    log.info(`File ${fileName}`)

    // if jsonObject is an Array
    if (Array.isArray(jsonObject)) {
      log.info(`Array with ${jsonObject.length} projects`)
      jsonObject.forEach(async (project) => {
        results.push(await useProject(project))
        debugger
      })
    } else {
      log.info('Single project')
      results.push(await useProject(jsonObject))
    }
  })

  console.log('Results', results)
  console.log('Results bla', bla)


  return res.json(results)
})

export default router

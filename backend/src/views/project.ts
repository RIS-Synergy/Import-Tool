import express, { Router, Request, Response } from "express"
import * as XLSX from "xlsx";
import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'view:project' });
// const fs = require('fs')
const router: any = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Project } from '@/models/Project.js'
import { Institution } from '@/models/Institution.js'
import { Excel } from '@/models/Excel.js'

import multer from 'multer'
const upload = multer();

async function useProject(project): Promise<any> {
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
router.post('/upload', upload.array('files'), async (req, res) => {
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

  log.info('Uplpad', bla)

  return res.json(results)
})

router.post('/download', async (req, res) => {
  const projects = await prisma.project.findMany({
  })
  const { ror } = req.body
  const institution = Institution.getByROR(ror)
  const projectsData = projects
    .map((project) => project.risData)
    .filter((project: any) => {
      const rorMatch = Project.hasROR(project.funded, ror)
      const domainMatch = Project.matchDomain(project.team, institution.domain)
      return rorMatch || domainMatch
    })
  log.info(`Found ${projectsData.length} projects`, institution)

  const format: string = req.body.format

  if (format === 'Excel') {
    // Convert JSON to Excel
    const workbook = Excel.write(projectsData)

    // Convert workbook to buffer
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="projects.xlsx"');
    res.send(Buffer.from(wbout));
  } else {
    res.json(projectsData);
  }
})

export default router

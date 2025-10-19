import express, { Router, Request, Response } from "express"
import { Logger } from "@/utils/logger.js";
import fs from 'fs'
const router: Router = express.Router()

// ÖFOS 2012 from https://www.data.gv.at/katalog/dataset/stat_ofos-2012
// Revisionsstand des Schlagwortverzeichnisses: Oktober 2021

const log = new Logger({ name: 'oefos'});

function loadCSVFile (lang = 'DE') {
  const csv = fs.readFileSync(`./resources/OEFOS2012_${lang}_CTI_utf8.csv`, 'utf-8')
  const lines = csv.split('\n')
  const headers = lines[0].split(';')
  const data = lines.slice(1).map(line => {
    const values = line.split(';')
    return headers.reduce((acc, header, i) => {
      // removed "", if there are any
      header = header.replace(/"/g, '')
      var result
      if (values[i] && values[i].startsWith('"')) {
        result = values[i].replace(/"/g, '')
        acc[header]
      } else {
        result = values[i]
      }
      acc[header] = result
      return acc
    }, {})
  })
  return data
}

function mapListToObject (source, key = 'Code') {
  return source.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
}

const data_de = mapListToObject(loadCSVFile('DE'))
const data_en = mapListToObject(loadCSVFile('EN'))

export function getValue (id, lang) {
  if (lang === 'DE') {
    return data_de[id]
  } else {
    return data_en[id]
  }
}

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const result = {
    de: data_de[id],
    en: data_en[id]
  }

  log.debug('ÖFOS 2012', id, result.de.Titel)

  res.json(result)
})

export default router

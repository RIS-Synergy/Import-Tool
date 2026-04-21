import fs from 'fs';
import path from 'path';
import { Logger } from "@/utils/logger.js";
import { fileURLToPath } from 'url';

const log = new Logger({ name: 'oefos:service' });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ÖFOS 2012 from https://www.data.gv.at/katalog/dataset/stat_ofos-2012
// Revisionsstand des Schlagwortverzeichnisses: Oktober 2021

function loadCSVFile(lang = 'DE') {
  // The resources directory is at the project root, which is 4 levels up from this file
  const resourcesPath = path.join(__dirname, '../../../resources');
  const filePath = path.join(resourcesPath, `OEFOS2012_${lang}_CTI_utf8.csv`);
  const csv = fs.readFileSync(filePath, 'utf-8');
  const lines = csv.split('\n');
  const headers = lines[0].split(';');
  const data = lines.slice(1).map(line => {
    const values = line.split(';');
    return headers.reduce((acc, header, i) => {
      // Remove quotes if present
      header = header.replace(/"/g, '');
      let result;
      if (values[i] && values[i].startsWith('"')) {
        result = values[i].replace(/"/g, '');
      } else {
        result = values[i];
      }
      acc[header] = result;
      return acc;
    }, {} as Record<string, string>);
  });
  return data;
}

function mapListToObject(source: Record<string, string>[], key = 'Code') {
  return source.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {} as Record<string, Record<string, string>>);
}

const data_de = mapListToObject(loadCSVFile('DE'));
const data_en = mapListToObject(loadCSVFile('EN'));

export function getValue (id, lang) {
  if (lang === 'DE') {
    return data_de[id]
  } else {
    return data_en[id]
  }
}

export class OefosService {
  public getById(id: string) {
    log.debug('ÖFOS 2012 lookup', id);

    const deEntry = data_de[id];
    const enEntry = data_en[id];

    if (!deEntry && !enEntry) {
      return null;
    }

    return {
      de: deEntry,
      en: enEntry
    };
  }

  public getAll() {
    return {
      de: Object.values(data_de),
      en: Object.values(data_en)
    };
  }
}

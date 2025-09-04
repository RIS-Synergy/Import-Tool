const fs = require('fs')

import { getAuthEndpoint } from "../src/utils/oauth2";
import { Registry } from "../src/models/Registry";
import { Project } from "../src/models/Project";

import { Logger } from "tslog";
const log = new Logger({ name: 'script:fa-api' });

const prefixUrl = 'project'

const pageSize = 1000;
// const pageSize = 1000000;
const page = 0;

const emailDomain = "akbild.ac.at"
const rorWhitelist = ['https://ror.org/029djt864']
const whitelistProjects = []
const withoutEmails = []
const mapDomain = {}
const riRORs = {}

async function main() {
  const registry = new Registry()
  await registry.run()

  const url = `${registry.getURL(prefixUrl, 'PROJECTS')}?page[page]=${page * pageSize}&page[size]=${pageSize}`
  console.log('url', url)

  const result = await getAuthEndpoint(url)

  console.log('====================')
  // number of projects
  console.log('Received total:', result.length)
  console.log('====================')

  for (let i = 0; i < result.length; i++) {
    const project = result[i]

    const { ror, name } = Project.findRORInfo(project.funded)

    const emails = project.team.map((member: any) => member.person.electronicAddress)

    // get email domain
    const email = emails[0]

    // some projects have no email
    let domain: string
    try {
      domain = email.split('@')[1]
    } catch (error) {
      // log.error('Error splitting email', project.id, project.team)
      withoutEmails.push(project)
      continue
    }

    if (project.team.length > 1) {
      log.warn('More than one team member', emails)
    }

    if (project.funded.length != 2) {
      log.warn('`funded` is not 2', project.id, project.funded)
    }

    if (Object.keys(project.funded[0])[0] != 'by') {
      log.warn('`funded[0]` is not `by`', project.id, project.funded[0])
    }

    if (Object.keys(project.funded[1])[0] != 'as') {
      log.warn('`funded[1]` is not `as`', project.id, project.funded[1])
    }

    const recipients = project.funded[1].as.recipients
    if (recipients.length != 1) {
      // log.warn('recipients != 1', project.id, recipients.length)
    }

    if (!mapDomain[domain]) {
      mapDomain[domain] = []
    }
    mapDomain[domain].push(project.id)
    // set ror, name into mapDomain[domain]
    if (!riRORs[ror]) {
      riRORs[ror] = name
    }

    if (rorWhitelist.includes(ror)) {
      whitelistProjects.push(project)
    }

    if (domain === emailDomain) {
      log.info(project.id, emails[0])
    }
  }

  console.log('====================')
  log.info('Without emails', withoutEmails.length)
  console.log('====================')

  // count domains and group - order length desc
  log.info('Person Domains')
  const domains = Object.keys(mapDomain).sort((a, b) => mapDomain[b].length - mapDomain[a].length)
  for (const domain of domains) {
    if (domain === emailDomain) {
      log.info(domain, "with email domain:", mapDomain[domain].length, "with ROR orgUnit", whitelistProjects.length)
    } else {
      // ignore domains with only one email address for this domain
      if (mapDomain[domain].length > 1) {
        log.silly(domain, mapDomain[domain].length)
      }
    }
  }

  // save json file
  fs.writeFileSync('resources/ri-RORs.json', JSON.stringify(riRORs, null, 2))

  // whitelistProjects
  console.log('====================')
  log.info('Whitelist Projects', whitelistProjects.length)
  fs.writeFileSync('resources/whitelistProjects.json', JSON.stringify(whitelistProjects, null, 2))
}

main()

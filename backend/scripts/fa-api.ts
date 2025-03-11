import { getAuthEndpoint } from "../src/utils/oauth2";
import { Registry } from "../src/models/Registry";

import { Logger } from "tslog";
const log = new Logger({ name: 'script:fa-api' });

const prefixUrl = 'project'

const pageSize = 1000;
const page = 0;

const emailDomain = "akbild.ac.at"
const withoutEmails = []
const mapDomain = {}

async function main () {
  await Registry.run()

  const url = `${Registry.getURL(prefixUrl, 'PROJECTS')}?page[page]=${page * pageSize}&page[size]=${pageSize}`
  console.log('url', url)

  const result = await getAuthEndpoint(url)
  // console.log(JSON.stringify(result, null, 2))

  console.log('====================')
  // number of projects
  console.log('Received total:', result.length)
  console.log('====================')

  for (let i = 0; i < result.length; i++) {
    const project = result[i]

    // log.debug (project)

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

    if (!mapDomain[domain]) {
      mapDomain[domain] = []
    }
    mapDomain[domain].push(project.id)

    if (domain === emailDomain) {
      log.info(project.id, emails[0])

      if (project.team.length > 1) {
        log.warn('More than one team member', emails)
      }
    }
  }

  console.log('====================')
  console.log('Without emails', withoutEmails.length)
  console.log('====================')

  // count domains and group - order length desc
  log.info ('Person Domains')
  const domains = Object.keys(mapDomain).sort((a, b) => mapDomain[b].length - mapDomain[a].length)
  for (const domain of domains) {
    log.info(domain, mapDomain[domain].length)
  }
}

main()

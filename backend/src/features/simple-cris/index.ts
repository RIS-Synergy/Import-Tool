import { Router, Request, Response } from "express";
import { Logger } from "../../utils/logger.js";

const log = new Logger({ name: "simple-cris" });

const router = Router();

router.use((req: Request, res: Response) => {
  log.info(`📄 CRIS simulation received ${req.method} request at ${req.url}`);
  // log.info("Headers:", req.headers);
  // log.info("Body:", JSON.stringify(req.body, null, 2));

  const maxMustermann = {
    pureId: 999999,
    uuid: 'mock-uuid-max-mustermann',
    name: {
      firstName: 'Max',
      lastName: 'Mustermann'
    },
    systemName: 'Person',
    user: {
      uuid: 'user-mock-uuid-1',
      systemName: 'User',
      username: 'MAXMUSTER'
    },
    orcids: [
      {
        orcid: '0000-0000-0000-0000'
      }
    ],
    emails: [
      {
        value: 'max.mustermann@example.com'
      }
    ],
    staffOrganizationAssociations: [
      {
        organization: {
          uuid: 'org-mock-uuid-1',
          systemName: 'Organization',
          name: { en_GB: 'Mock Department' }
        }
      }
    ]
  };

  if (req.url.includes('/organizations/')) {
    return res.json({
      uuid: req.url.split('/').pop(),
      name: { en_GB: 'Mock Department' }
    });
  }

  if (req.url.includes('/users/')) {
    return res.json({
      uuid: req.url.split('/').pop(),
      username: 'MAXMUSTER',
      email: 'max.mustermann@example.com'
    });
  }

  let items: any[] = [];

  if (req.url.includes('/persons/search')) {
    items.push(maxMustermann);
  } else if (req.url.includes('/external-persons/search')) {
    items.push({
      ...maxMustermann,
      pureId: 888888,
      uuid: 'mock-uuid-external-mustermann',
      name: { firstName: 'External Max', lastName: 'Mustermann' },
      systemName: 'ExternalPerson'
    });
  } else {
    items.push({
      method: req.method,
      url: req.url,
      body: req.body,
    });
  }

  res.json({ items });
});

export default router;

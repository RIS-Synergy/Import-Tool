import { Router, Request, Response } from "express";

const router = Router();

router.use((req: Request, res: Response) => {
  const externalMaxMustermann = {
    pureId: 888888,
    uuid: 'mock-uuid-external-mustermann',
    name: {
      firstName: 'Max',
      lastName: 'Mustermann'
    },
    systemName: 'ExternalPerson',
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

  res.json({ items: [externalMaxMustermann] });
});

export default router;

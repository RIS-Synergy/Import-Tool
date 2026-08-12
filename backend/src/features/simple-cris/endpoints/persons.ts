import { Router, Request, Response } from "express";

const router = Router();

router.use((req: Request, res: Response) => {
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

  res.json({ items: [maxMustermann] });
});

export default router;

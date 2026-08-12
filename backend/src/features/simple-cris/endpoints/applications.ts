import { Router, Request, Response } from "express";

const router = Router();

router.use((req: Request, res: Response) => {
  if (req.url.includes('search')) {
    const mockApplication = {
      pureId: 100002,
      uuid: 'mock-uuid-application-1',
      systemName: 'Application',
      entityType: 'applications',
      title: {
        en_GB: req.body.searchString || 'My Application',
        de_DE: 'Mein Antrag'
      },
      modifiedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      identifiers: [],
      cluster: {
        systemName: 'ApplicationCluster',
        uuid: 'mock-uuid-application-cluster-1'
      }
    };
    return res.json({ items: [mockApplication] });
  }

  // Handle GET/PUT for single resource
  const pathPart = req.url.split('/').filter(Boolean).pop();
  const uuid = pathPart && pathPart !== 'applications' ? pathPart : 'mock-uuid-application-1';
  res.json({ uuid });
});

export default router;

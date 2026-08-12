import { Router, Request, Response } from "express";

const router = Router();

router.use((req: Request, res: Response) => {
  if (req.url.includes('search')) {
    const mockAward = {
      pureId: 100003,
      uuid: 'mock-uuid-award-1',
      systemName: 'Award',
      entityType: 'awards',
      title: {
        en_GB: req.body.searchString || 'My Award',
        de_DE: 'Meine Auszeichnung'
      },
      modifiedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      identifiers: [],
      cluster: {
        systemName: 'AwardCluster',
        uuid: 'mock-uuid-award-cluster-1'
      }
    };
    return res.json({ items: [mockAward] });
  }

  // Handle GET/PUT for single resource
  const pathPart = req.url.split('/').filter(Boolean).pop();
  const uuid = pathPart && pathPart !== 'awards' ? pathPart : 'mock-uuid-award-1';
  res.json({ uuid });
});

export default router;

import { Router, Request, Response } from "express";

const router = Router();

router.use((req: Request, res: Response) => {
  if (req.url.includes('search')) {
    const mockProject = {
      pureId: 100001,
      uuid: 'mock-uuid-project-1',
      systemName: 'Project',
      entityType: 'projects',
      title: {
        en_GB: req.body.searchString || 'My Project',
        de_DE: 'Mein Projekt'
      },
      modifiedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      identifiers: [],
      cluster: null
    };
    return res.json({ items: [mockProject] });
  }

  // Handle GET/PUT for single resource
  const pathPart = req.url.split('/').filter(Boolean).pop();
  const uuid = pathPart && pathPart !== 'projects' ? pathPart : 'mock-uuid-project-1';
  res.json({ uuid });
});

export default router;

import { Router, Request, Response } from "express";

const router = Router();

router.use((req: Request, res: Response) => {
  const uuid = req.url.split('/').pop();
  res.json({
    uuid,
    name: { en_GB: 'Mock Department' }
  });
});

export default router;

import { Router } from 'express';
import { ProjectController } from './project.controller.js';
// import { projectIdSchema } from './project.validation.js';
// import { validate } from '../../middleware/validator.js';

const router = Router();
const controller = new ProjectController();

router.post('/', controller.getMany); // '/' will be a POST, as an exception. [Bad design long-term]
router.post('/stats', controller.getStats);
router.get('/search', controller.search);
// router.get('/:id', validate(projectIdSchema, "params"), controller.getById);
// router.get('/ris/:risId', controller.getByRisId);
// router.put('/:id', validate(projectIdSchema, "params"), controller.update);
// router.delete('/:id', validate(projectIdSchema, "params"), controller.delete);

export default router;

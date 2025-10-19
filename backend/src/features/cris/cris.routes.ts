import { Router } from 'express';
import { CRISController } from './cris.controller.js';
import { createCRISSchema, crisIdSchema, searchSchema, referenceSchema } from './cris.validation.js';
import { validate } from '@/middleware/validator.js'

const router = Router();
const controller = new CRISController();

router.get('/', controller.getMany);
router.post('/', validate(createCRISSchema, "body"), controller.create);
router.post('/search', validate(searchSchema, "body"), controller.search);
router.post('/reference', validate(referenceSchema, "body"), controller.reference);
router.get('/:id', validate(crisIdSchema, "params"), controller.getById);
router.put('/:id', validate(crisIdSchema, "params"), validate(createCRISSchema, "body"), controller.update);
router.delete('/:id', validate(crisIdSchema, "params"), controller.delete);

export default router;

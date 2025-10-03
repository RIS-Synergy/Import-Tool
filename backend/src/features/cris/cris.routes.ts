import { Router } from 'express';
import { CRISController } from './cris.controller.js';
import { createCRISSchema, crisIdSchema } from './cris.validation.js';
import { validate } from '../../middleware/validator.js'

const router = Router();
const crisController = new CRISController();

router.get('/', crisController.getAllCRIS);
router.post('/', validate(createCRISSchema, "body"), crisController.createCRIS);
router.get('/:id', validate(crisIdSchema, "params"), crisController.getCRISById);
router.put('/:id', validate(crisIdSchema, "params"), validate(createCRISSchema, "body"), crisController.updateCRIS);
router.delete('/:id', validate(crisIdSchema, "params"), crisController.deleteCRIS);

export default router;

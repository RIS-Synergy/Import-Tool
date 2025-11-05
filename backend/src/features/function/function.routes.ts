import { Router } from 'express';
import { FunctionController } from './function.controller.js';
import {
  functionNameSchema,
  functionCreateOrUpdateSchema,
  functionVerifySchema
} from './function.validation.js';
import { validate } from '@/middleware/validator.js';

const router = Router();
const controller = new FunctionController();

router.get('/', controller.getAll);
router.post('/', validate(functionCreateOrUpdateSchema, "body"), controller.createOrUpdate);
router.get('/:name', validate(functionNameSchema, "params"), controller.getByName);
router.put('/:name',
  validate(functionNameSchema, "params"),
  validate(functionVerifySchema, "body"),
  controller.verify
);
router.delete('/:name', validate(functionNameSchema, "params"), controller.delete);

export default router;

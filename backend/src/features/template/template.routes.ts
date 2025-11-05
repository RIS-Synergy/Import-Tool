import { Router } from 'express';
import { TemplateController } from './template.controller.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdSchema,
  templateTypeSchema,
  verifyTemplateSchema,
  getIdAndType
} from './template.validation.js';
import { validate } from '@/middleware/validator.js'

const router = Router();
const controller = new TemplateController();

router.get('/:type',
           validate(templateTypeSchema, "params"),
           controller.getMany);
router.get('/:type/:id',
           validate(getIdAndType, "params"),
           controller.getById);
router.post('/', validate(createTemplateSchema, "body"), controller.create);
router.put('/:id',
           validate(templateIdSchema, "params"),
           validate(updateTemplateSchema, "body"),
           controller.update);
router.put('/:id/yaml',
           validate(templateIdSchema, "params"),
           validate(verifyTemplateSchema, "body"),
           controller.updateYaml);
router.post('/verify', validate(verifyTemplateSchema, "body"), controller.verify);

export default router;

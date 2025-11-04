import { Router } from 'express';
import { TransformController } from './transform.controller.js';
import { uploadSchema } from './transform.validation.js';
import { validate } from '@/middleware/validator.js';

const router = Router();
const controller = new TransformController();

router.post('/upload', validate(uploadSchema, 'body'), controller.upload);

export default router;

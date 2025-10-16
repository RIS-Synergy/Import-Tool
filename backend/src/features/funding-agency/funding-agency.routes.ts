import { Router } from 'express';
import { FundingAgencyController } from './funding-agency.controller.js';
import { createFundingAgencySchema, fundingAgencyIdSchema } from './funding-agency.validation.js';
import { validate } from '../../middleware/validator.js'

const router = Router();
const controller = new FundingAgencyController();

router.get('/', controller.getMany);
router.post('/', validate(createFundingAgencySchema, "body"), controller.create);
router.get('/:id/sync', controller.sync);
router.get('/:id', validate(fundingAgencyIdSchema, "params"), controller.getById);
router.put('/:id', validate(fundingAgencyIdSchema, "params"), validate(createFundingAgencySchema, "body"), controller.update);

export default router;

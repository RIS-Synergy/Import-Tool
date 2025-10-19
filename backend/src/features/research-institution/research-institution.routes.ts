import { Router } from 'express';
import { ResearchInstitutionController } from './research-institution.controller.js';
import { createResearchInstitutionSchema, researchInstitutionIdSchema } from './research-institution.validation.js';
import { validate } from '@/middleware/validator.js'

const router = Router();
const researchInstitutionController = new ResearchInstitutionController();

router.get('/',
           researchInstitutionController.getAllResearchInstitutions);

router.post('/',
            validate(createResearchInstitutionSchema, "body"),
            researchInstitutionController.createResearchInstitution);

router.get('/:id',
           validate(researchInstitutionIdSchema, "params"),
           researchInstitutionController.getResearchInstitutionById);

export default router;

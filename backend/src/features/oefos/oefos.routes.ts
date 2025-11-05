import { Router } from 'express';
import { OefosService } from './oefos.service.js';
import { validate } from '@/middleware/validator.js';
import { oefosIdSchema } from './oefos.validation.js';

const router = Router();
const service = new OefosService();

router.get('/:id', validate(oefosIdSchema, 'params'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = service.getById(id);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: `OEFOS entry with id ${id} not found` });
    }
  } catch (error) {
    console.error('Error retrieving OEFOS entry:', error);
    res.status(500).json({ message: 'Error retrieving OEFOS entry' });
  }
});

export default router;

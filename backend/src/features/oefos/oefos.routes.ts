import { Router } from 'express';
import { OefosService } from './oefos.service.js';
import { validate } from '@/middleware/validator.js';
import { oefosIdSchema } from './oefos.validation.js';

const router = Router();
const service = new OefosService();

router.get('/', async (req, res) => {
  try {
    const result = service.getAll();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retrieving OeFOS entries:', error);
    res.status(500).json({ message: 'Error retrieving OeFOS entries' });
  }
});

router.get('/:id', validate(oefosIdSchema, 'params'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = service.getById(id);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: `OeFOS entry with id ${id} not found` });
      return;
    }
    res.json(entry);
  } catch (error) {
    console.error('Error retrieving OeFOS entry:', error);
    res.status(500).json({ message: 'Error retrieving OeFOS entry' });
  }
});

export default router;

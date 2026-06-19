import { Router } from 'express';
import * as ctrl from '../controllers/applications.controller';
import { createValidators, updateValidators } from '../middleware/validators';

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', createValidators, ctrl.createOne);
router.patch('/:id', updateValidators, ctrl.updateOne);
router.delete('/:id', ctrl.deleteOne);

export default router;

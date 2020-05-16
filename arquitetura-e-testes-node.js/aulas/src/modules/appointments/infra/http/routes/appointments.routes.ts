import { Router } from 'express';

import authMiddleware from '@modules/users/infra/http/middlewares/auth';

import AppointmentController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController();

appointmentsRouter.use(authMiddleware);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;

import { Router } from 'express';

import authMiddleware from '@modules/users/infra/http/middlewares/auth';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(authMiddleware);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;

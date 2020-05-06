import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import authMiddleware from '@modules/users/infra/http/middlewares/auth';

// import User from '../models/User';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// usersRouter.get('/', async (request, response) => {
//   const userRepository = getRepository(User);

//   const users = await userRepository.find();

//   return response.json(users);
// });

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;

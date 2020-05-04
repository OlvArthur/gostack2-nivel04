import { Router } from 'express';
import multer from 'multer';
// import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import authMiddleware from '../middlewares/auth';

// import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

// usersRouter.get('/', async (request, response) => {
//   const userRepository = getRepository(User);

//   const users = await userRepository.find();

//   return response.json(users);
// });

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    email,
    name,
    password,
  });

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const { id } = request.user;
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;

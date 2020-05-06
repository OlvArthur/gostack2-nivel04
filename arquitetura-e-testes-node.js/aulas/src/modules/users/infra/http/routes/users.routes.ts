import { Router } from 'express';
import multer from 'multer';
// import { getRepository } from 'typeorm';

import uploadConfig from '@config/upload';

import authMiddleware from '@modules/users/infra/http/middlewares/auth';

// import User from '../models/User';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const usersRouter = Router();
const upload = multer(uploadConfig);

// usersRouter.get('/', async (request, response) => {
//   const userRepository = getRepository(User);

//   const users = await userRepository.find();

//   return response.json(users);
// });

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const usersRepository = new UsersRepository();
  const createUser = new CreateUserService(usersRepository);

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
    const usersRepository = new UsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const user = await updateUserAvatar.execute({
      user_id: id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;

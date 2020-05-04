import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface RequestDTO {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError('Only logged users can change avatar', 401);
    }

    if (user.avatar) {
      // Achar o caminho do arquivo
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFilePathExists = await fs.promises.stat(
        userAvatarFilePath,
      );

      if (userAvatarFilePathExists) {
        // Deletar o arquivo
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFileName;

    await usersRepository.save(user);
    return user;
  }
}
export default UpdateUserAvatarService;

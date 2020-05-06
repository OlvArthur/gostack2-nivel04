import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatarFileName,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

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

    await this.usersRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;

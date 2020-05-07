import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakehashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456',
    });

    return expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with existent email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456',
    });

    return expect(
      createUserService.execute({
        name: 'Arthur',
        email: 'arthur@inobras.co',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
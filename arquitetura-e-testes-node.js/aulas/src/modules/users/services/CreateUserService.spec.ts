import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakehashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456',
    });

    return expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with existent email', async () => {
    await createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Arthur',
        email: 'arthur@inobras.co',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

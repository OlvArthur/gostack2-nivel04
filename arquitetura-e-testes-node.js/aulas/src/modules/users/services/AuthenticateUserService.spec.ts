import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakehashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to authenticate non existing email', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'arthur4@inobras.co',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '1234567',
    });

    await expect(
      authenticateUserService.execute({
        email: 'arthur@inobras.co',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate', async () => {
    await createUserService.execute({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '123456',
    });

    const { token } = await authenticateUserService.execute({
      email: 'arthur@inobras.co',
      password: '123456',
    });

    expect(token).toBeTruthy();
  });
});

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakehashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should not be able to authenticate non existing email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    return expect(
      authenticateUserService.execute({
        email: 'arthur4@inobras.co',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '1234567',
    });

    return expect(
      authenticateUserService.execute({
        email: 'arthur@inobras.co',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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

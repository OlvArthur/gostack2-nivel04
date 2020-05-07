import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should not be able to login with wrong email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    const createUserService = new CreateUserService(fakeUsersRepository);

    await createUserService.execute({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '123456',
    });

    return expect(
      authenticateUserService.execute({
        email: 'arthur4@inobras.co',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to login with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    const createUserService = new CreateUserService(fakeUsersRepository);

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
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    const createUserService = new CreateUserService(fakeUsersRepository);

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

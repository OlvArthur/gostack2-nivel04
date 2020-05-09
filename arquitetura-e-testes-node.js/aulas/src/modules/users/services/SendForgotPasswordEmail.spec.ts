import AppError from '@shared/errors/AppError';

import FakemailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotEmailPasswordService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
  it('should be able to retrieve the password using email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeEmailProvider = new FakemailProvider();

    const sendForgotEmailPasswordService = new SendForgotEmailPasswordService(
      fakeUsersRepository,
      fakeEmailProvider,
    );

    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    await fakeUsersRepository.create({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '123456',
    });

    await sendForgotEmailPasswordService.execute({
      email: 'arthur@inobras.co',
    });

    return expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to retrive a non-existing user password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeEmailProvider = new FakemailProvider();

    const sendForgotEmailPasswordService = new SendForgotEmailPasswordService(
      fakeUsersRepository,
      fakeEmailProvider,
    );

    await expect(
      sendForgotEmailPasswordService.execute({
        email: 'arthur@inobras.co',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

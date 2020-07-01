"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

var _FakehashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakehashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeUserTokensRepository;
let fakeHashProvider;
let resetPasswordService;
describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    fakeHashProvider = new _FakehashProvider.default();
    resetPasswordService = new _ResetPasswordService.default(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
  });
  it('should be able to reset the password', async () => {
    const {
      id
    } = await fakeUsersRepository.create({
      email: 'jhondoe@example.com',
      name: 'Jhon Doe',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokensRepository.generate(id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPasswordService.execute({
      password: '123123',
      token
    });
    const updatedUser = await fakeUsersRepository.findById(id);
    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('123123');
  });
  it('should not able to reset the password with non existing token', async () => {
    await expect(resetPasswordService.execute({
      password: '123123',
      token: 'non-existing password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset the password with non-existing user', async () => {
    const {
      token
    } = await fakeUserTokensRepository.generate('non-exisiting user');
    await expect(resetPasswordService.execute({
      password: '123123',
      token
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to reset the password only within two hours', async () => {
    const {
      id
    } = await fakeUsersRepository.create({
      email: 'jhondoe@example.com',
      name: 'Jhon Doe',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokensRepository.generate(id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    await expect(resetPasswordService.execute({
      password: '123123',
      token
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});
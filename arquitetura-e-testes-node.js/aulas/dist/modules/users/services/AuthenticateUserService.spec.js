"use strict";

var _FakehashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakehashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

require("dotenv/config");

var _AuthenticateUserService = _interopRequireDefault(require("./AuthenticateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let authenticateUserService;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakehashProvider.default();
    authenticateUserService = new _AuthenticateUserService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('should not be able to authenticate non existing email', async () => {
    await expect(authenticateUserService.execute({
      email: 'arthur4@inobras.co',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '1234567'
    });
    await expect(authenticateUserService.execute({
      email: 'arthur@inobras.co',
      password: '12345678'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to authenticate', async () => {
    await fakeUsersRepository.create({
      email: 'arthur@inobras.co',
      name: 'Arthur',
      password: '123456'
    });
    const {
      token
    } = await authenticateUserService.execute({
      email: 'arthur@inobras.co',
      password: '123456'
    });
    expect(token).toBeTruthy();
  });
});
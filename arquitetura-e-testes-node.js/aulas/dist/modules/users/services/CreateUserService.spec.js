"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakehashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakehashProvider"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let createUserService;
let fakeCacheProvider;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakehashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createUserService = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456'
    });
    return expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user with existent email', async () => {
    await createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456'
    });
    await expect(createUserService.execute({
      name: 'Arthur',
      email: 'arthur@inobras.co',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});
"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakehashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakehashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let updateProfileService;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakehashProvider.default();
    updateProfileService = new _UpdateProfileService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456'
    });
    await updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com'
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name).toBe('Jane Doe');
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email).toBe('janedoe@example.com');
  });
  it('should not be able to update non-existing user profile', async () => {
    await expect(updateProfileService.execute({
      user_id: 'non-existing user',
      name: 'Jane Doe',
      email: 'janedoe@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update email to an already existent email', async () => {
    await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456'
    });
    const user = await fakeUsersRepository.create({
      name: 'jane Doe',
      email: 'janedoe@example.com',
      password: '123456'
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'jane Doe',
      email: 'jhondoe@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456'
    });
    await updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      old_password: '123456',
      password: '123123'
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password without confirming old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456'
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456'
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      old_password: 'wrong-password',
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});
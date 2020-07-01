"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let createAppointmentService;
let fakeNotificationsRepository;
let fakeCacheProvider;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointmentService = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 22).getTime();
    });
    const appointment = await createAppointmentService.execute({
      user_id: 'user_id',
      date: new Date(2020, 5, 10, 8),
      provider_id: 'provider_id'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });
  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2021, 6, 10, 11);
    await createAppointmentService.execute({
      user_id: 'user_id',
      date: appointmentDate,
      provider_id: 'provider_id'
    });
    await expect(createAppointmentService.execute({
      user_id: 'user_id',
      date: appointmentDate,
      provider_id: 'provider_id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 22).getTime();
    });
    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 5, 10),
      provider_id: 'provider_id',
      user_id: 'user_id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 22).getTime();
    });
    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 15, 10),
      provider_id: 'user',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment outside business hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 22).getTime();
    });
    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 15, 6),
      provider_id: 'provider_id',
      user_id: 'user_id'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointmentService.execute({
      date: new Date(2020, 4, 15, 23),
      provider_id: 'provider_id',
      user_id: 'user_id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});
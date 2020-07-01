"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _ListProviderAppointmentsService = _interopRequireDefault(require("./ListProviderAppointmentsService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AppError from '@shared/errors/AppError';
let listProviderAppointmentsService;
let fakeAppointmentsRepository;
let fakeCacheProvider;
describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviderAppointmentsService = new _ListProviderAppointmentsService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it("should be able to list a provider's day's appointments", async () => {
    const appoitment1 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 9, 15, 11),
      provider_id: 'provider_id',
      user_id: 'user_id'
    });
    const appoitment2 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 9, 15, 14),
      provider_id: 'provider_id',
      user_id: 'user_id'
    });
    const appointments = await listProviderAppointmentsService.execute({
      day: 15,
      month: 10,
      year: 2021,
      provider_id: 'provider_id'
    });
    expect(appointments).toEqual(expect.arrayContaining([appoitment1, appoitment2]));
  });
});
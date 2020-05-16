import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      user_id: 'user_id',
      date: new Date(),
      provider_id: 'provider_id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointmentService.execute({
      user_id: 'user_id',
      date: appointmentDate,
      provider_id: 'provider_id',
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user_id',
        date: appointmentDate,
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

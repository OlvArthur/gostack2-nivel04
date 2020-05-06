import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '485793874589',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('485793874589');
  });

  // it('should not be able to create two appointments at the same time', () => {
  //   expect(1 + 2).toBe(3);
  // });
});

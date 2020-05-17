import { startOfHour, isBefore } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  date: Date;
  user_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 17) {
      throw new AppError("You can't schedule outside business hours");
    }

    if (provider_id === user_id) {
      throw new AppError("You can't schedule an appointment with youself");
    }

    const currentDate = new Date(Date.now());

    if (isBefore(appointmentDate, new Date(`${currentDate} UTC`))) {
      throw new AppError('Past dates are not available');
    }

    const findAppointmentinSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentinSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;

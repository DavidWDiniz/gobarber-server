import "reflect-metadata";
import {startOfHour} from "date-fns";
import {injectable, inject} from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import AppError from "../../../shared/errors/AppError";

interface Request {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    async execute({date, provider_id}: Request): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError("This time is already booked.");
        }

        return await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });
    }
}

export default CreateAppointmentService;

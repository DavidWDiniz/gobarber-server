import "reflect-metadata";
import {startOfHour, isBefore, getHours, format} from "date-fns";
import {injectable, inject} from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import AppError from "../../../shared/errors/AppError";
import INotificationsRepository from "../../notifications/repositories/INotificationsRepository";
import ICacheProvider from "../../../shared/container/providers/CacheProvider/models/ICacheProvider";

interface Request {
    user_id: string;
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,

        @inject("NotificationsRepository")
        private notificationsRepository: INotificationsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) {}

    async execute({date, provider_id, user_id}: Request): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't create an appointment in a past date.");
        }

        if (user_id === provider_id) {
            throw new AppError("You can't create an appointment with yourself.");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError("You can only create appointments between 8am and 5pm.");
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
        );

        if (findAppointmentInSameDate) {
            throw new AppError("This time is already booked.");
        }

        const appointment = await this.appointmentsRepository.create({
            user_id,
            provider_id,
            date: appointmentDate,
        });

        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para o dia ${dateFormatted}`
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${provider_id}:${format(appointmentDate, "yyyy-M-d")}`
        );

        return appointment;
    }
}

export default CreateAppointmentService;

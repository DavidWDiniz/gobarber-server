import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import {getHours} from "date-fns";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface Request {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type Response = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    async execute({provider_id, month, year, day}: Request): Promise<Response> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            month,
            year,
            day
        });

        const hourStart = 8;
        const eachHourArray = Array.from(
            {length: 10},
            (_, index) => index + hourStart,
        );
        return eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(appointment =>
                getHours(appointment.date) === hour
            );
            return {
                hour,
                available: !hasAppointmentInHour,
            }
        });
    }
}

export default ListProviderDayAvailabilityService;

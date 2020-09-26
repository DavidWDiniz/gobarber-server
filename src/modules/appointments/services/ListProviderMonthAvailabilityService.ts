import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import {getDate, getDaysInMonth} from "date-fns";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface Request {
    provider_id: string;
    month: number;
    year: number;
}

type Response = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    async execute({provider_id, month, year}: Request): Promise<Response> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            month,
            year
        });
        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
        const eachDayArray = Array.from(
            {length: numberOfDaysInMonth},
            (_, index) => index + 1
        );
        return eachDayArray.map(day => {
            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day
            });
            return {
                day,
                available: appointmentsInDay.length < 10,
            };
        });
    }
}

export default ListProviderMonthAvailabilityService;

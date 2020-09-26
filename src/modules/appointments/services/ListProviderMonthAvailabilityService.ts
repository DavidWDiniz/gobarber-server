import "reflect-metadata";
import {inject, injectable} from "tsyringe";

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
        console.log(appointments);
        return [{day: 1, available: false}];
    }
}

export default ListProviderMonthAvailabilityService;

import "reflect-metadata";
import {inject, injectable} from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface Request {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    async execute({provider_id, day, month, year}: Request): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            day,
            month,
            year
        });
    }
}

export default ListProviderAppointmentsService;

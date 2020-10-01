import "reflect-metadata";
import {inject, injectable} from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import ICacheProvider from "../../../shared/container/providers/CacheProvider/models/ICacheProvider";

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
        private appointmentsRepository: IAppointmentsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) {}

    async execute({provider_id, day, month, year}: Request): Promise<Appointment[]> {
        const cacheData = await this.cacheProvider.recover("abc");
        console.log(cacheData);
        const appointments = this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            day,
            month,
            year
        });

        await this.cacheProvider.save("abc", "def");

        return appointments;
    }
}

export default ListProviderAppointmentsService;

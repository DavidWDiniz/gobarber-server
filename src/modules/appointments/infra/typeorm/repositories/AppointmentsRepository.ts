import {getRepository, Repository, Raw} from "typeorm";

import IAppointmentsRepository from "../../../repositories/IAppointmentsRepository";
import Appointment from "../entities/Appointment";
import ICreateAppointmentDTO from "../../../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "../../../dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "../../../dtos/IFindAllInDayFromProviderDTO";

class AppointmentsRepository implements  IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }
    async findByDate(date: Date): Promise<Appointment | undefined> {
        return await this.ormRepository.findOne({
            where: {date}
        });
    }

    async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, "0");
        const parsedMonth = String(month).padStart(2, "0");
        return await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, "DD-MM-YYYY") = "${parsedDay}-${parsedMonth}-${year}"`
                )
            }
        });
    }

    async findAllInMonthFromProvider({provider_id, year, month}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, "0");
        return await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, "MM-YYYY") = "${parsedMonth}-${year}"`
                )
            }
        });
    }

    async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({provider_id, date});
        await this.ormRepository.save(appointment);
        return appointment;
    }
}

export default AppointmentsRepository;

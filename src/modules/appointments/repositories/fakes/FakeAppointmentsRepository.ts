import {v4 as uuid} from "uuid";
import {isEqual, getMonth, getYear, getDate} from "date-fns";

import IAppointmentsRepository from "../IAppointmentsRepository";
import Appointment from "../../infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from "../../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "../../dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "../../dtos/IFindAllInDayFromProviderDTO";

class FakeAppointmentsRepository implements  IAppointmentsRepository {
    protected appointments: Appointment[] = [];

    async findByDate(date: Date): Promise<Appointment | undefined> {
        return this.appointments.find(appointment =>
            isEqual(appointment.date, date)
        );
    }

    async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        return this.appointments.filter(appointment =>
            appointment.provider_id === provider_id &&
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        );
    }

    async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        return this.appointments.filter(appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
        );
    }

    async create({user_id, provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {id: uuid(), user_id, provider_id, date});

        this.appointments.push(appointment);

        return appointment;
    }
}

export default FakeAppointmentsRepository;

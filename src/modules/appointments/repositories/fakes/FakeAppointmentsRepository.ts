import {v4 as uuid} from "uuid";
import {isEqual} from "date-fns";

import IAppointmentsRepository from "../IAppointmentsRepository";
import Appointment from "../../infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from "../../dtos/ICreateAppointmentDTO";

class FakeAppointmentsRepository implements  IAppointmentsRepository {
    protected appointments: Appointment[] = [];
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        return this.appointments.find(appointment =>
            isEqual(appointment.date, date)
        );
    }

    public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {id: uuid(), provider_id, date});

        this.appointments.push(appointment);

        return appointment;
    }
}

export default FakeAppointmentsRepository;

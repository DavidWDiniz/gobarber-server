import {getRepository, Repository, Not} from "typeorm";

import User from "../entities/User";
import ICreateUserDTO from "../../../dtos/ICreateUserDTO";
import IUsersRepository from "../../../repositories/IUsersRepository";
import IFindAllProvidersDTO from "../../../dtos/IFindAllProvidersDTO";

class UsersRepository implements  IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];
        if (except_user_id) {
            users = await this.ormRepository.find({where: {
                id: Not(except_user_id),
            }});
        } else {
            users = await this.ormRepository.find();
        }
        return users;
    }

    async findById(id: string): Promise<User | undefined> {
        return await this.ormRepository.findOne(id);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.ormRepository.findOne({where: {email}});
    }

    async create(userData: ICreateUserDTO): Promise<User> {
        const appointment = this.ormRepository.create(userData);
        await this.ormRepository.save(appointment);
        return appointment;
    }

    async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;

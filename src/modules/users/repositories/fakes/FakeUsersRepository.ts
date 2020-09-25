import {v4 as uuid} from "uuid";

import User from "../../infra/typeorm/entities/User";
import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import IUsersRepository from "../IUsersRepository";
import IFindAllProvidersDTO from "../../dtos/IFindAllProvidersDTO";

class FakeUsersRepository implements  IUsersRepository {
    protected users: User[] = [];

    async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<User[]> {
        let {users} = this;
        if (except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id);
        }
        return users;
    }

    async findById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();
        Object.assign(user, {id: uuid()}, userData);
        this.users.push(user);
        return user;
    }

    async save(user: User): Promise<User> {
        const findByIndex = this.users.findIndex(findUser => findUser.id === user.id);
        this.users[findByIndex] = user;
        return user;
    }
}

export default FakeUsersRepository;

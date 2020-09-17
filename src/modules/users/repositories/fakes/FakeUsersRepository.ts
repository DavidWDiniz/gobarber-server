import {v4 as uuid} from "uuid";

import User from "../../infra/typeorm/entities/Users";
import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import IUsersRepository from "../IUsersRepository";

class FakeUsersRepository implements  IUsersRepository {
    protected users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();
        Object.assign(user, {id: uuid()}, userData);
        this.users.push(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        const findByIndex = this.users.findIndex(findUser => findUser.id === user.id);
        this.users[findByIndex] = user;
        return user;
    }
}

export default FakeUsersRepository;

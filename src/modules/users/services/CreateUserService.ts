import "reflect-metadata";
import {injectable, inject} from "tsyringe";

import User from "../infra/typeorm/entities/User";
import AppError from "../../../shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface Request {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) {}
    async execute({name, email, password}: Request): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError("Email address already used");
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        return await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });
    }
}

export default CreateUserService;

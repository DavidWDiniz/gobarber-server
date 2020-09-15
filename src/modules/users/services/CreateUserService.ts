import {hash} from "bcryptjs"
import {injectable, inject} from "tsyringe";

import User from "../infra/typeorm/entities/Users";
import AppError from "../../../shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";

interface Request {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}
    public async execute({name, email, password}: Request): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError("Email address already used");
        }

        const hashedPassword = await hash(password, 8);

        return await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });
    }
}

export default CreateUserService;

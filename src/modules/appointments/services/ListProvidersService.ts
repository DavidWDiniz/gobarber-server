import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import IUsersRepository from "../../users/repositories/IUsersRepository";
import User from "../../users/infra/typeorm/entities/User";

interface Request {
    user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) {}

    async execute({user_id}: Request): Promise<User[]> {
        return await this.usersRepository.findAllProviders({
            except_user_id: user_id
        });
    }
}

export default ListProvidersService;

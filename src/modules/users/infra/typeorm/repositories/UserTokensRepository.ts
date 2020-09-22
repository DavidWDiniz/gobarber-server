import {getRepository, Repository} from "typeorm";

import UserToken from "../entities/UserToken";
import IUserTokensRepository from "../../../repositories/IUserTokensRepository";

class UserTokensRepository implements  IUserTokensRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    async findByToken(token: string): Promise<UserToken | undefined> {
        return await this.ormRepository.findOne({where: {token}});
    }

    async generate(user_id: string): Promise<UserToken> {
        const userToken = await this.ormRepository.create({
            user_id
        });
        await this.ormRepository.save(userToken);
        return userToken;
    }

}

export default UserTokensRepository;

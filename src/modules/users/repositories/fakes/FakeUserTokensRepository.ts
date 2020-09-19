import {v4 as uuid} from "uuid";

import IUserTokensRepository from "../IUserTokensRepository";
import UserToken from "../../infra/typeorm/entities/UserToken";

class FakeUserTokensRepository implements  IUserTokensRepository {
    protected userTokens: UserToken[] = [];

    async generate(user_id: string): Promise<UserToken> {
        const userToken = new UserToken();
        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id
        });

        this.userTokens.push(userToken);
        return userToken;
    }

}

export default FakeUserTokensRepository;

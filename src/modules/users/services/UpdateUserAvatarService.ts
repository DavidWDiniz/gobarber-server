import "reflect-metadata";
import {inject, injectable} from "tsyringe";

import User from "../infra/typeorm/entities/User";
import AppError from "../../../shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import IStorageProvider from "../../../shared/container/providers/StorageProvider/models/IStorageProvider";

interface Request {
    user_id: string;
    avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}
    async execute({user_id, avatarFileName}: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("Only authenticated users can change avatar.", 401);
        }

        if (user.avatar) {
           await this.storageProvider.deleteFile(user.avatar);
        }

        user.avatar = await this.storageProvider.saveFile(avatarFileName);
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;

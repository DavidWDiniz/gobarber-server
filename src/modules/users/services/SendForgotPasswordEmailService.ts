import "reflect-metadata";
import {injectable, inject} from "tsyringe";

import IUsersRepository from "../repositories/IUsersRepository";
import IMailProvider from "../../../shared/container/providers/MailProvider/models/IMailProvider";

interface Request {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("MailProvider")
        private mailProvider: IMailProvider,
    ) {}
    public async execute({email}: Request): Promise<void> {
        await this.mailProvider.sendMail(
            email,
            "Pedido de recuperação de e-mail recebido"
        );
    }
}

export default SendForgotPasswordEmailService;

import IMailProvider from "../models/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";

export default class FakeMailProvider implements IMailProvider{
    protected message: ISendMailDTO[] = [];

    async sendMail(message: ISendMailDTO): Promise<void> {
        this.message.push(message);
    }
}

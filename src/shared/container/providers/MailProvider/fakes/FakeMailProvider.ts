import IMailProvider from "../models/IMailProvider";

interface Message {
    to: string;
    body: string;
}

export default class FakeMailProvider implements IMailProvider{
    protected message: Message[] = [];

    async sendMail(to: string, body: string): Promise<void> {
        this.message.push({to, body});
    }
}

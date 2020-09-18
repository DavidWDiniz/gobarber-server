import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "../../../shared/container/providers/MailProvider/fakes/FakeMailProvider";

describe("CreateUser", () => {
    it("should be able to recover the password using the email", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();

        const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

        const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider);

        await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456"
        });

        await sendForgotPasswordEmailService.execute({
            email: "test@test.com"
        });

        expect(sendMail).toHaveBeenCalled();
    });

});

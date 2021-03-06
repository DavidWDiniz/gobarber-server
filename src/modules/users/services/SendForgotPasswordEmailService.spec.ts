import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "../../../shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import AppError from "../../../shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let fakeUserTokensRepository: FakeUserTokensRepository;


describe("CreateUser", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
    });

    it("should be able to recover the password using the email", async () => {
        const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

        await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456"
        });

        await sendForgotPasswordEmail.execute({
            email: "test@test.com"
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to recover a non-existing user password", async () => {
        await expect(sendForgotPasswordEmail.execute({
            email: "test@test.com"
        })).rejects.toBeInstanceOf(AppError);
    });

    it("should generate a forgot password token", async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

        const user = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456"
        });

        await sendForgotPasswordEmail.execute({
            email: "test@test.com"
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});

import AuthenticateUserService from "./AuthenticateUserService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe("AuthenticateUser", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it("should be able to authenticate", async () => {
        const user = await createUserService.execute({
            name: "test",
            email: "test@test.com",
            password: "123456"
        })

        const response = await authenticateUser.execute({
            email: "test@test.com",
            password: "123456"
        });

        expect(response).toHaveProperty("token");
        expect(response.user).toEqual(user);
    });

    it("should not be able to authenticate with non existing user", async () => {
        await expect(authenticateUser.execute({
            email: "test@test.com",
            password: "123456"
        })).rejects.toBeInstanceOf(AppError);

    });

    it("should not be able to authenticate with wrong password", async () => {
        await createUserService.execute({
            name: "test",
            email: "test@test.com",
            password: "123456"
        })

        await expect(authenticateUser.execute({
            email: "test@test.com",
            password: "wrong-password"
        })).rejects.toBeInstanceOf(AppError);
    });

});

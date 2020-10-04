import FakeUsersRepository from "../../users/repositories/fakes/FakeUsersRepository";
import ListProvidersService from "./ListProvidersService";
import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe("ListProviders", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
    });

    it("should be able to list the providers", async () => {
        const user1 = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456",
        });

        const user2 = await fakeUsersRepository.create({
            name: "test2",
            email: "test2@test.com",
            password: "123456",
        });

        const loggedUser = await fakeUsersRepository.create({
            name: "test3",
            email: "test3@test.com",
            password: "123456",
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});

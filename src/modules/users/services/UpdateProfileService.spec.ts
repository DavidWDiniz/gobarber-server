import AppError from "../../../shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it("should be able to update the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456",
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "test 2",
            email: "test2@test.com",
        });

        expect(updatedUser.name).toBe("test 2");
        expect(updatedUser.email).toBe("test2@test.com");
    });

    it("should not be able to update email to an already using email", async () => {
        const user = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456",
        });

        await fakeUsersRepository.create({
            name: "test 2",
            email: "test2@test.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "test3",
                email: "test2@test.com",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to update the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456",
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "test 2",
            email: "test2@test.com",
            password: "654321",
            old_password: "123456",
        });

        expect(updatedUser.password).toBe("654321");
    });

    it("should not be able to update the password with wrong current password", async () => {
        const user = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "test 2",
                email: "test2@test.com",
                password: "654321",
                old_password: "wrong-old-password",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to update the password without current password", async () => {
        const user = await fakeUsersRepository.create({
            name: "test",
            email: "test@test.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "test 2",
                email: "test2@test.com",
                password: "654321",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to update the profile of a non-existing user", async () => {
        await expect(
            updateProfile.execute({
                user_id: "non-existing-id",
                name: "test",
                email: "test@test.com",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

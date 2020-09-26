import ListProviderMonthAvailabilityService from "./ListProviderMonthAvailabilityService";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe("ListProviderMonthAvailability", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
    });

    it("should be able to list the month availability from provider", async () => {
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 7, 26, 10, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 8, 26, 10, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 8, 26, 12, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 8, 27, 10, 0, 0)
        });

        const availability = await listProviderMonthAvailability.execute({
            provider_id: "user",
            month: 9,
            year: 2020
        });

        expect(availability).toEqual(expect.arrayContaining([
            {day: 25, available: true},
            {day: 26, available: false},
            {day: 27, available: false},
            {day: 28, available: true},
        ]));
    });
});

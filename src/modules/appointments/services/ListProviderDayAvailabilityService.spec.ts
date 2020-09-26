import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe("ListProviderDayAvailability", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
    });

    it("should be able to list the day availability from provider", async () => {
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 7, 26, 14, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2020, 7, 26, 15, 0, 0)
        });

        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2020, 7, 26, 11).getTime();
        });

        const availability = await listProviderDayAvailability.execute({
            provider_id: "user",
            month: 8,
            year: 2020,
            day: 26
        });

        expect(availability).toEqual(expect.arrayContaining([
            {hour: 8, available: false},
            {hour: 9, available: false},
            {hour: 10, available: false},
            {hour: 13, available: true},
            {hour: 14, available: false},
            {hour: 15, available: false},
            {hour: 16, available: true},
        ]));
    });
});

import {ObjectID} from "mongodb";

import INotificationsRepository from "../INotificationsRepository";
import ICreateNotificationDTO from "../../dtos/ICreateNotificationDTO";
import Notification from "../../infra/typeorm/schemas/Notification";

class FakeNotificationsRepository implements  INotificationsRepository {
    protected notifications: Notification[] = [];

    async create({content, recipient_id}: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();
        Object.assign(notification, {id: new ObjectID(), content, recipient_id});
        this.notifications.push(notification);
        return notification;
    }
}

export default FakeNotificationsRepository;
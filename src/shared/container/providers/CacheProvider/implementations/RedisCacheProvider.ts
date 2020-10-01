import Redis, {Redis as RedisClient} from "ioredis";
import cacheConfig from "../../../../../config/cache";

import ICacheProvider from "../models/ICacheProvider";

export default class RedisCacheProvider implements ICacheProvider{
    private client: RedisClient;
    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    async save(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async invalidate(key: string): Promise<void> {
    }

    async recover(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

}

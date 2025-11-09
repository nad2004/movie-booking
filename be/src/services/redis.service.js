import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisUrl =
        process.env.REDIS_URL ||
        `redis://${process.env.REDIS_PASSWORD ? ":" + process.env.REDIS_PASSWORD + "@" : ""}${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}/${process.env.REDIS_DB || 0}`;

      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              return new Error("Redis max retries reached");
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      this.client.on("connect", () => {
        console.log("Redis connected");
        this.isConnected = true;
      });

      this.client.on("error", (err) => {
        console.error("Redis error:", err);
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error("Redis connection error:", error);
      this.isConnected = false;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (!this.isConnected || !this.client) return null;
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return null;
    }
  }

  async get(key) {
    try {
      if (!this.isConnected || !this.client) return null;
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected || !this.client) return null;
      return await this.client.del(key);
    } catch (error) {
      return null;
    }
  }

  async delPattern(pattern) {
    try {
      if (!this.isConnected || !this.client) return null;
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.client.del(keys);
    } catch (error) {
      return null;
    }
  }

  async cache(key, fetchFunction, ttl = 3600) {
    try {
      const cached = await this.get(key);
      if (cached) return cached;
      const data = await fetchFunction();
      await this.set(key, data, ttl);
      return data;
    } catch (error) {
      return await fetchFunction();
    }
  }

  async invalidateMovieCache(movieId) {
    await this.delPattern(`movie:${movieId}*`);
    await this.delPattern("movies:*");
  }

  async invalidateScheduleCache(scheduleId) {
    await this.delPattern(`schedule:${scheduleId}*`);
    await this.delPattern("schedules:*");
  }

  async invalidateUserCache(userId) {
    await this.delPattern(`user:${userId}*`);
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

const redisService = new RedisService();

if (process.env.REDIS_ENABLED !== "false") {
  redisService.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
}

export default redisService;

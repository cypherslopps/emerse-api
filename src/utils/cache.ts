import redis from "redis";

const client = redis.createClient();
console.log(client);

export const cache = (key, dataFn) => async () => {
    const cachedData = await client.get(key);

    // if (cachedData) return JSON.parse(cachedData);

    // const data = await dataFn();

    // client.setex(key, 3600, JSON.stringify(data));

    // return data;
}

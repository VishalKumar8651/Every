const redis = require('redis');

let redisClient;

(async () => {
    redisClient = redis.createClient();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));

    await redisClient.connect();
})();

module.exports = redisClient;

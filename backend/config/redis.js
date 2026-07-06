const redis = require('redis');

let redisClient;

(async () => {
    redisClient = redis.createClient({
        // Add a retry strategy to avoid excessive connection error logs if Redis is down
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    return new Error('Redis reconnection failed after 10 retries');
                }
                return Math.min(retries * 100, 3000);
            }
        }
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err.message));
    redisClient.on('connect', () => console.log('Redis Client Connected'));

    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis. Caching will be disabled.');
    }
})();

module.exports = redisClient;

const redis = require('redis');

let redisClient;

(async () => {
    try {
        redisClient = redis.createClient();
        redisClient.on('error', (err) => {
            // Log once then disable if it's a connection error
            if (err.code === 'ECONNREFUSED') {
                console.warn('Redis not available. Running without caching.');
                redisClient.isReady = false;
            } else {
                console.error('Redis Client Error', err);
            }
        });
        
        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
            redisClient.isReady = true;
        });

        await redisClient.connect();
    } catch (err) {
        console.warn('Could not connect to Redis. Caching disabled.');
        redisClient = {
            isReady: false,
            get: async () => null,
            setEx: async () => null,
            del: async () => null,
            connect: async () => {}
        };
    }
})();

module.exports = new Proxy({}, {
    get: (target, prop) => {
        if (!redisClient || !redisClient.isReady) {
            if (prop === 'get' || prop === 'setEx' || prop === 'del') {
                return async () => null;
            }
        }
        return redisClient ? redisClient[prop] : null;
    }
});

const redis = require('redis');

let redisClient;

(async () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> d869e6103f170c08bfb8b62ed2f1fc86f74240c3
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

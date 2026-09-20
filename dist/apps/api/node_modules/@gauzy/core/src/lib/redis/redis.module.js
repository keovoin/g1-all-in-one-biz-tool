"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.EVER_REDIS_CLIENT = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
exports.EVER_REDIS_CLIENT = 'EVER_REDIS_CLIENT';
let RedisModule = class RedisModule {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async onModuleDestroy() {
        if (this.redisClient) {
            try {
                await this.redisClient.quit();
                common_1.Logger.log('Redis client disconnected gracefully', 'RedisModule');
            }
            catch (error) {
                common_1.Logger.error('Error disconnecting Redis client', error, 'RedisModule');
            }
        }
    }
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.EVER_REDIS_CLIENT,
                useFactory: async () => {
                    if (process.env.REDIS_ENABLED !== 'true')
                        return null;
                    const { REDIS_URL, REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_TLS } = process.env;
                    if (!REDIS_URL && (!REDIS_HOST || !REDIS_PORT))
                        return null;
                    const url = REDIS_URL ||
                        (() => {
                            const proto = REDIS_TLS === 'true' ? 'rediss' : 'redis';
                            const auth = REDIS_PASSWORD
                                ? `${REDIS_USER || ''}:${REDIS_PASSWORD}@`
                                : '';
                            return `${proto}://${auth}${REDIS_HOST}:${REDIS_PORT}`;
                        })();
                    try {
                        const client = (0, redis_1.createClient)({ url });
                        client.on('error', (err) => common_1.Logger.error('Redis client error', err, 'RedisModule'));
                        await client.connect();
                        common_1.Logger.log('Redis client connected for atomic operations', 'RedisModule');
                        return client;
                    }
                    catch (error) {
                        common_1.Logger.warn('Redis client connection failed, falling back to cache-manager', 'RedisModule');
                        return null;
                    }
                }
            }
        ],
        exports: [exports.EVER_REDIS_CLIENT]
    }),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__param(0, (0, common_1.Inject)(exports.EVER_REDIS_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [void 0])
], RedisModule);
//# sourceMappingURL=redis.module.js.map
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class GithubModule implements NestModule {
    /**
     * Configures middleware for specific routes.
     *
     * @param consumer - The middleware consumer to apply the middlewares.
     */
    configure(consumer: MiddlewareConsumer): void;
}

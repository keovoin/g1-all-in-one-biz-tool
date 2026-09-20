import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class IntegrationAIModule implements NestModule {
    /**
     * Configures middleware for specific routes and methods.
     * @param consumer The middleware consumer to apply middleware to routes.
     */
    configure(consumer: MiddlewareConsumer): void;
}

import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class MakeComModule implements NestModule {
    /**
     * Configures the middleware for the MakeCom module.
     *
     * @param consumer - The MiddlewareConsumer instance used to apply middleware.
     */
    configure(consumer: MiddlewareConsumer): void;
}

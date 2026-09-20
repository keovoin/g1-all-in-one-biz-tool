import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class CoreModule implements NestModule {
    /**
     * Configures middleware for the application.
     *
     * This method applies the specified middleware to the application using the
     * provided `MiddlewareConsumer`. In this case, the `RequestContextMiddleware`
     * is applied to all routes in the application.
     *
     * @param consumer - The `MiddlewareConsumer` provided by NestJS, used to manage
     * middleware configurations for the application.
     */
    configure(consumer: MiddlewareConsumer): void;
}

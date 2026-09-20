import { MiddlewareConsumer, NestModule, OnApplicationShutdown } from '@nestjs/common';
export declare class BootstrapModule implements NestModule, OnApplicationShutdown {
    /**
     * Configures middleware for the application.
     * This method applies middleware to all routes in the application.
     *
     * @param consumer - An instance of `MiddlewareConsumer` that allows configuring middleware in the app.
     */
    configure(consumer: MiddlewareConsumer): void;
    /**
     * Handles cleanup and resource shutdown logic when the application receives a termination signal.
     * This method dynamically shuts down tracing if enabled and logs the shutdown process.
     *
     * @param signal - The signal causing the application shutdown (e.g., SIGTERM).
     */
    onApplicationShutdown(signal: string): Promise<void>;
}

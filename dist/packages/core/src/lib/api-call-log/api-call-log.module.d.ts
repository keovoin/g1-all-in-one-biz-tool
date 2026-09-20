import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class ApiCallLogModule implements NestModule {
    /**
     * Configures the middleware for Time Tracking routes (POST, PUT, PATCH, DELETE)
     * excluding the '/timesheet/statistics' route.
     *
     * @param consumer The middleware consumer used to apply the middleware to specific routes.
     */
    configure(consumer: MiddlewareConsumer): void;
}

import { OnApplicationBootstrap } from '@nestjs/common';
export declare class AppBootstrapLogger implements OnApplicationBootstrap {
    private readonly logger;
    private readonly startTime;
    /**
     * Logs the total startup time when the application finishes bootstrapping.
     * This method calculates the duration from the recorded start time and logs the result
     * in a human-readable format (minutes and seconds).
     */
    onApplicationBootstrap(): void;
}

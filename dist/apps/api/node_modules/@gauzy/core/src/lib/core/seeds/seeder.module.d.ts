import { DynamicModule } from '@nestjs/common';
/**
 * Import and provide seeder classes.
 *
 * @module
 */
export declare class SeederModule {
    /**
     * Dynamic configuration for SeederModule with plugin support.
     * Use this for optional or plugin-related seeding logic.
     */
    static forPlugins(): DynamicModule;
}

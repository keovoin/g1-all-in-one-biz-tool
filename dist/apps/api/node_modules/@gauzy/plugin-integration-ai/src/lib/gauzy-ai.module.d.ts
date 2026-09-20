import { DynamicModule } from '@nestjs/common';
import { IConfigurationOptions } from './configuration.interface';
export declare class GauzyAIModule {
    /**
     * Configure the GauzyAI module for integration with Ever Gauzy Platform.
     * @param options Optional configuration options for GauzyAI.
     * @returns A dynamic module configuration object.
     */
    static forRoot(options?: IConfigurationOptions): DynamicModule;
}

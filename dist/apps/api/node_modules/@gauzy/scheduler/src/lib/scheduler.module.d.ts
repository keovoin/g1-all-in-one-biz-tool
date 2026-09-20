import { DynamicModule, Type } from '@nestjs/common';
import { SchedulerFeatureOptions } from './interfaces/scheduler-feature-options.interface';
import { SchedulerModuleOptions } from './interfaces/scheduler-module-options.interface';
export declare class SchedulerModule {
    static forRoot(options?: SchedulerModuleOptions): DynamicModule;
    static forFeature(optionsOrProviders?: SchedulerFeatureOptions | Type<unknown>[]): DynamicModule;
}

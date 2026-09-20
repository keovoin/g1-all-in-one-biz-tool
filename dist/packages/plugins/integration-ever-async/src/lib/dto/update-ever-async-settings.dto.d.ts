import { ConfigureEverAsyncIntegrationDto } from './configure-ever-async-integration.dto';
declare const UpdateEverAsyncSettingsDto_base: import("@nestjs/common").Type<Partial<ConfigureEverAsyncIntegrationDto>>;
export declare class UpdateEverAsyncSettingsDto extends UpdateEverAsyncSettingsDto_base {
    readonly isEnabled?: boolean;
}
export {};

import { EverAsyncUserMappingDto } from './ever-async-user-mapping.dto';
export declare class ConfigureEverAsyncIntegrationDto {
    readonly serverUrl: string;
    readonly userMappings?: EverAsyncUserMappingDto[];
    readonly projectIds?: string[];
}

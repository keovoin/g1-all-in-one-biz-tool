import { IPlugin } from '@gauzy/contracts';
import { LegacyFindOneOptions } from '@gauzy/core';
export declare class PluginQueryOptions implements LegacyFindOneOptions<IPlugin> {
    readonly where?: Partial<IPlugin>;
    readonly relations?: string[];
    readonly select?: (keyof IPlugin)[];
    readonly order?: {
        [P in keyof IPlugin]?: 'ASC' | 'DESC';
    };
    readonly withDeleted?: boolean;
    readonly loadEagerRelations?: boolean;
}

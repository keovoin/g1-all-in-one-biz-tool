import { ID } from '@gauzy/contracts';
import { PluginVersionDTO } from './plugin-version.dto';
import { IPluginVersionUpdate } from '../models/plugin-version.model';
import { IPluginSourceUpdate } from '../models/plugin-source.model';
declare const UpdatePluginVersionDTO_base: import("@nestjs/common").Type<Partial<Omit<PluginVersionDTO, "pluginId" | "plugin" | "sources">>>;
export declare class UpdatePluginVersionDTO extends UpdatePluginVersionDTO_base implements IPluginVersionUpdate {
    readonly id: ID;
    readonly sources?: IPluginSourceUpdate[];
}
export {};

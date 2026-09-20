import { ID } from '@gauzy/contracts';
import { PluginSourceDTO } from './plugin-source.dto';
import { IPluginSourceUpdate } from '../models/plugin-source.model';
declare const UpdatePluginSourceDTO_base: import("@nestjs/common").Type<Partial<Omit<PluginSourceDTO, "version">>>;
export declare class UpdatePluginSourceDTO extends UpdatePluginSourceDTO_base implements IPluginSourceUpdate {
    readonly id: ID;
}
export {};

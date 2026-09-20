import { PluginVersion } from '../../domain/entities/plugin-version.entity';
import { PluginSourceDTO } from './plugin-source.dto';
declare const PluginVersionDTO_base: import("@nestjs/common").Type<Omit<PluginVersion, "id" | "createdAt" | "updatedAt" | "deletedAt" | "sources" | "downloadCount">>;
export declare class PluginVersionDTO extends PluginVersionDTO_base {
    sources: PluginSourceDTO[];
}
export {};

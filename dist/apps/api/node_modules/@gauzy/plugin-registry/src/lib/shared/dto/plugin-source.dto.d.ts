import { PluginSource } from '../../domain/entities/plugin-source.entity';
declare const PluginSourceDTO_base: import("@nestjs/common").Type<Omit<PluginSource, "id" | "createdAt" | "updatedAt" | "deletedAt" | "fullName">>;
export declare class PluginSourceDTO extends PluginSourceDTO_base {
}
export {};

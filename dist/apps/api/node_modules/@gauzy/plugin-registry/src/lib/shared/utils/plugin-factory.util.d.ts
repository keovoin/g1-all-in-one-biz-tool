import { CreatePluginDTO } from '../dto/create-plugin.dto';
import { PluginVersionDTO } from '../dto/plugin-version.dto';
import { PluginSourceDTO } from '../dto/plugin-source.dto';
export declare class PluginFactory {
    static create(input: CreatePluginDTO): CreatePluginDTO;
    static createVersion(input: PluginVersionDTO): PluginVersionDTO;
    static createSource(inputs: PluginSourceDTO[]): PluginSourceDTO[];
}

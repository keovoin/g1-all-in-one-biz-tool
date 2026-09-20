import { IQueryHandler } from '@nestjs/cqrs';
import { PluginService } from '../../../../domain';
import { IPlugin } from '../../../../shared';
import { GetPluginQuery } from '../get-plugin.query';
export declare class GetPluginQueryHandler implements IQueryHandler<GetPluginQuery> {
    private readonly pluginService;
    constructor(pluginService: PluginService);
    execute(query: GetPluginQuery): Promise<IPlugin>;
}

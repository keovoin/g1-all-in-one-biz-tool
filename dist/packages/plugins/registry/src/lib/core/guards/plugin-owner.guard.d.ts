import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PluginService } from '../../domain/services/plugin.service';
export declare class PluginOwnerGuard implements CanActivate {
    private readonly pluginService;
    constructor(pluginService: PluginService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getPluginIdFromRequest;
}

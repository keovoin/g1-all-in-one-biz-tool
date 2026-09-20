import { ID } from '@gauzy/contracts';
import { CommandBus } from '@nestjs/cqrs';
declare enum InstallationStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class UpdateInstallationStatusDTO {
    status: InstallationStatus;
}
export declare class PluginActivationController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    updateStatus(pluginId: ID, installationId: ID, { status }: UpdateInstallationStatusDTO): Promise<void>;
}
export {};

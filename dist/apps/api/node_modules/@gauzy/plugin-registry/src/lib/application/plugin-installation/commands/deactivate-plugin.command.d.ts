import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeactivatePluginCommand implements ICommand {
    readonly installationId: ID;
    static readonly type = "[Plugin] Deactivate";
    constructor(installationId: ID);
}

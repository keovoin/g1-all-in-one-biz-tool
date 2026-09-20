import { ICommand } from '@nestjs/cqrs';
import { IIntegrationMapSyncScreenshot, IIntegrationMapSyncEntity } from '@gauzy/contracts';
export declare class IntegrationMapSyncScreenshotCommand implements ICommand {
    readonly input: IIntegrationMapSyncEntity<IIntegrationMapSyncScreenshot>;
    static readonly type = "[Integration Map] Sync Screenshot";
    constructor(input: IIntegrationMapSyncEntity<IIntegrationMapSyncScreenshot>);
}

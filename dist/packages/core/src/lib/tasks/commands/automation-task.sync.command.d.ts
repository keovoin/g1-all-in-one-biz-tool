import { IIntegrationMapSyncEntity, ITaskCreateInput, ITaskUpdateInput, IntegrationEntity } from '@gauzy/contracts';
export declare class AutomationTaskSyncCommand {
    readonly input: IIntegrationMapSyncEntity<ITaskCreateInput | ITaskUpdateInput>;
    readonly entity: IntegrationEntity;
    constructor(input: IIntegrationMapSyncEntity<ITaskCreateInput | ITaskUpdateInput>, entity: IntegrationEntity);
}

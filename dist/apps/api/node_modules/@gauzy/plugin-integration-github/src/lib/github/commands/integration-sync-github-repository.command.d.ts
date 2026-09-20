import { ICommand } from '@nestjs/cqrs';
import { IIntegrationMapSyncRepository } from '@gauzy/contracts';
export declare class IntegrationSyncGithubRepositoryCommand implements ICommand {
    readonly input: IIntegrationMapSyncRepository;
    static readonly type = "[Integration] Sync Github Repository";
    constructor(input: IIntegrationMapSyncRepository);
}

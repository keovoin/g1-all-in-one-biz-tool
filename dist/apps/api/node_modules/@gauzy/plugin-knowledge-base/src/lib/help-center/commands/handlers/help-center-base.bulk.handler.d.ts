import { ICommandHandler } from '@nestjs/cqrs';
import { KnowledgeBaseBulkDeleteCommand } from '../help-center-base.bulk.command';
import { HelpCenterService } from '../../help-center.service';
export declare class KnowledgeBaseBulkDeleteHandler implements ICommandHandler<KnowledgeBaseBulkDeleteCommand> {
    private readonly helpCenterService;
    constructor(helpCenterService: HelpCenterService);
    execute(command: KnowledgeBaseBulkDeleteCommand): Promise<any>;
}

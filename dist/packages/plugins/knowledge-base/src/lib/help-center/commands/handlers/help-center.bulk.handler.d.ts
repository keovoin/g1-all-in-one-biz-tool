import { ICommandHandler } from '@nestjs/cqrs';
import { HelpCenter } from '../../help-center.entity';
import { HelpCenterService } from '../../help-center.service';
import { HelpCenterUpdateCommand } from '../help-center.bulk.command';
export declare class HelpCenterUpdateHandler implements ICommandHandler<HelpCenterUpdateCommand> {
    private readonly helpCenterService;
    constructor(helpCenterService: HelpCenterService);
    execute(command: HelpCenterUpdateCommand): Promise<HelpCenter[]>;
    diff: (oldChildren: any, newChildren: any) => any;
}

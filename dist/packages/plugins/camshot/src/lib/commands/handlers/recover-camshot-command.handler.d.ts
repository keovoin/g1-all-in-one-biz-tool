import { ICommandHandler } from '@nestjs/cqrs';
import { RecoverCamshotCommand } from '../recover-camshot.command';
import { CamshotService } from '../../services/camshot.service';
import { ICamshot } from '../../models/camshot.model';
export declare class RecoverCamshotCommandHandler implements ICommandHandler<RecoverCamshotCommand> {
    private readonly camshotService;
    constructor(camshotService: CamshotService);
    execute(command: RecoverCamshotCommand): Promise<ICamshot>;
}

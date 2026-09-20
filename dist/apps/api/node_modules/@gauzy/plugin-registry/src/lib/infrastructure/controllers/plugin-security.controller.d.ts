import { ID } from '@gauzy/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { VerifyPluginDTO } from '../../shared';
export declare class PluginSecurityController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    createVerification(id: ID, input: VerifyPluginDTO): Promise<boolean>;
}

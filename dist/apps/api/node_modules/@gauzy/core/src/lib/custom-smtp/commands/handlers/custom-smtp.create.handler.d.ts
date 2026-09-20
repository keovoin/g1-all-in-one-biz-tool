import { ICommandHandler } from '@nestjs/cqrs';
import { ICustomSmtp } from '@gauzy/contracts';
import { CustomSmtpService } from '../../custom-smtp.service';
import { CustomSmtpCreateCommand } from '../custom-smtp.create.command';
export declare class CustomSmtpCreateHandler implements ICommandHandler<CustomSmtpCreateCommand> {
    private readonly _customSmtpService;
    constructor(_customSmtpService: CustomSmtpService);
    execute(command: CustomSmtpCreateCommand): Promise<ICustomSmtp>;
}

import { ICommandHandler } from '@nestjs/cqrs';
import { ISoundshot } from '../../models/soundshot.model';
import { SoundshotService } from '../../services/soundshot.service';
import { CreateSoundshotCommand } from '../create-soundshot.command';
export declare class CreateSoundshotCommandHandler implements ICommandHandler<CreateSoundshotCommand> {
    private readonly soundshotService;
    constructor(soundshotService: SoundshotService);
    execute(command: CreateSoundshotCommand): Promise<ISoundshot>;
}

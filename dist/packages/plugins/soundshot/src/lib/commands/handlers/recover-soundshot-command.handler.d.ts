import { ICommandHandler } from '@nestjs/cqrs';
import { RecoverSoundshotCommand } from '../recover-soundshot.command';
import { SoundshotService } from '../../services/soundshot.service';
import { ISoundshot } from '../../models/soundshot.model';
export declare class RecoverSoundshotCommandHandler implements ICommandHandler<RecoverSoundshotCommand> {
    private readonly soundshotService;
    constructor(soundshotService: SoundshotService);
    execute(command: RecoverSoundshotCommand): Promise<ISoundshot>;
}

import { ICommandHandler } from '@nestjs/cqrs';
import { SoundshotService } from '../../services/soundshot.service';
import { DeleteSoundshotCommand } from '../delete-soundshot.command';
export declare class DeleteSoundshotCommandHandler implements ICommandHandler<DeleteSoundshotCommand> {
    private readonly soundshotService;
    constructor(soundshotService: SoundshotService);
    /**
     * Handles the `DeleteSoundshotCommand` to delete a soundshot entity from the database.
     * Validates the existence of the soundshot and performs the deletion based on the provided criteria.
     *
     * @param command - The `DeleteSoundshotCommand` containing the soundshot ID and additional options for deletion.
     *
     * @returns A promise that resolves when the soundshot is successfully deleted.
     *
     * @throws {NotFoundException} If the soundshot with the specified ID does not exist.
     */
    execute(command: DeleteSoundshotCommand): Promise<void>;
}

import { ICommandHandler } from '@nestjs/cqrs';
import { CamshotService } from '../../services/camshot.service';
import { DeleteCamshotCommand } from '../delete-camshot.command';
export declare class DeleteCamshotCommandHandler implements ICommandHandler<DeleteCamshotCommand> {
    private readonly camshotService;
    constructor(camshotService: CamshotService);
    /**
     * Handles the `DeleteCamshotCommand` to delete a camshot entity from the database.
     * Validates the existence of the camshot and performs the deletion based on the provided criteria.
     *
     * @param command - The `DeleteCamshotCommand` containing the camshot ID and additional options for deletion.
     *
     * @returns A promise that resolves when the camshot is successfully deleted.
     *
     * @throws {NotFoundException} If the camshot with the specified ID does not exist.
     */
    execute(command: DeleteCamshotCommand): Promise<void>;
}

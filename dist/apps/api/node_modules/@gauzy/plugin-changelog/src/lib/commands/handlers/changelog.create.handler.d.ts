import { IChangelog } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { ChangelogService } from '../../changelog.service';
import { ChangelogCreateCommand } from '../changelog.create.command';
export declare class ChangelogCreateHandler implements ICommandHandler<ChangelogCreateCommand> {
    private readonly changelogService;
    constructor(changelogService: ChangelogService);
    execute(command: ChangelogCreateCommand): Promise<IChangelog>;
}

import { IChangelog } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { ChangelogService } from '../../changelog.service';
import { ChangelogUpdateCommand } from '../changelog.update.command';
export declare class ChangelogUpdateHandler implements ICommandHandler<ChangelogUpdateCommand> {
    private readonly changelogService;
    constructor(changelogService: ChangelogService);
    execute(command: ChangelogUpdateCommand): Promise<IChangelog>;
}

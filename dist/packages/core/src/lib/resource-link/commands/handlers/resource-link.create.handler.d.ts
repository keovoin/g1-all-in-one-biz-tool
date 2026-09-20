import { ICommandHandler } from '@nestjs/cqrs';
import { IResourceLink } from '@gauzy/contracts';
import { ResourceLinkService } from '../../resource-link.service';
import { ResourceLinkCreateCommand } from '../resource-link.create.command';
export declare class ResourceLinkCreateHandler implements ICommandHandler<ResourceLinkCreateCommand> {
    private readonly resourceLinkService;
    constructor(resourceLinkService: ResourceLinkService);
    execute(command: ResourceLinkCreateCommand): Promise<IResourceLink>;
}

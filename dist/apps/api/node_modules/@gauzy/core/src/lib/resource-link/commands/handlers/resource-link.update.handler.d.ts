import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IResourceLink } from '@gauzy/contracts';
import { ResourceLinkService } from '../../resource-link.service';
import { ResourceLinkUpdateCommand } from '../resource-link.update.command';
export declare class ResourceLinkUpdateHandler implements ICommandHandler<ResourceLinkUpdateCommand> {
    private readonly resourceLinkService;
    constructor(resourceLinkService: ResourceLinkService);
    execute(command: ResourceLinkUpdateCommand): Promise<IResourceLink | UpdateResult>;
}

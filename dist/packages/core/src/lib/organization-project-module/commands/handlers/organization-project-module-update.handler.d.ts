import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IOrganizationProjectModule } from '@gauzy/contracts';
import { OrganizationProjectModuleUpdateCommand } from '../organization-project-module-update.command';
import { OrganizationProjectModuleService } from '../../organization-project-module.service';
export declare class OrganizationProjectModuleUpdateHandler implements ICommandHandler<OrganizationProjectModuleUpdateCommand> {
    private readonly organizationProjectModuleService;
    constructor(organizationProjectModuleService: OrganizationProjectModuleService);
    /**
     * @description Executes the OrganizationProjectModuleUpdateCommand
     * @param {OrganizationProjectModuleUpdateCommand} command  The command containing the Module ID and update data.
     * @returns The updated module.
     * @memberof OrganizationProjectModuleUpdateHandler
     */
    execute(command: OrganizationProjectModuleUpdateCommand): Promise<IOrganizationProjectModule | UpdateResult>;
}

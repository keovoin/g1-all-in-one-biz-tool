import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationProjectModule } from '@gauzy/contracts';
import { OrganizationProjectModuleCreateCommand } from '../organization-project-module-create.command';
import { OrganizationProjectModuleService } from '../../organization-project-module.service';
export declare class OrganizationProjectModuleCreateHandler implements ICommandHandler<OrganizationProjectModuleCreateCommand> {
    private readonly organizationProjectModuleService;
    constructor(organizationProjectModuleService: OrganizationProjectModuleService);
    /**
     * @description Executes the OrganizationProjectModuleCreateCommand
     * @param {OrganizationProjectModuleCreateCommand} command  The command containing the Module create data.
     * @returns The created module.
     * @memberof OrganizationProjectModuleCreateHandler
     */
    execute(command: OrganizationProjectModuleCreateCommand): Promise<IOrganizationProjectModule>;
}

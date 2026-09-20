import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { EventBus } from '../../../event-bus/event-bus';
import { IntegrationTenantService } from '../../integration-tenant.service';
import { IntegrationTenantDeleteCommand } from '../integration-tenant.delete.command';
export declare class IntegrationTenantDeleteHandler implements ICommandHandler<IntegrationTenantDeleteCommand> {
    private readonly _integrationTenantService;
    private readonly _eventBus;
    constructor(_integrationTenantService: IntegrationTenantService, _eventBus: EventBus);
    /**
     * Execute the command to delete the integration tenant.
     * @param command - The IntegrationTenantDeleteCommand instance.
     */
    execute(command: IntegrationTenantDeleteCommand): Promise<DeleteResult>;
}

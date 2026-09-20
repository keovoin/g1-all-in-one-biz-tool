import { ICommandHandler } from '@nestjs/cqrs';
import { IntegrationEntitySettingTiedService } from './../../integration-entity-setting-tied.service';
import { IntegrationEntitySettingTiedUpdateCommand } from '../integration-entity-setting-tied.update.command';
import { IntegrationTenantService } from './../../../integration-tenant/integration-tenant.service';
export declare class IntegrationEntitySettingTiedUpdateHandler implements ICommandHandler<IntegrationEntitySettingTiedUpdateCommand> {
    private readonly _integrationEntitySettingTiedService;
    private readonly _integrationTenantService;
    constructor(_integrationEntitySettingTiedService: IntegrationEntitySettingTiedService, _integrationTenantService: IntegrationTenantService);
    execute(command: IntegrationEntitySettingTiedUpdateCommand): Promise<any>;
}

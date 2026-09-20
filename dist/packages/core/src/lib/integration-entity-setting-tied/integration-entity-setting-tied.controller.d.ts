import { CommandBus } from '@nestjs/cqrs';
import { IIntegrationEntitySettingTied } from '@gauzy/contracts';
export declare class IntegrationEntitySettingTiedController {
    private readonly _commandBus;
    constructor(_commandBus: CommandBus);
    /**
     *
     * @param integrationId
     * @param entity
     * @returns
     */
    updateIntegrationEntitySettingTiedByIntegration(integrationId: string, entity: any): Promise<IIntegrationEntitySettingTied>;
}

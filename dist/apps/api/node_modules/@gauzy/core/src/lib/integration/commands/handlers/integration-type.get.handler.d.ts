import { ICommandHandler } from '@nestjs/cqrs';
import { IIntegrationType } from '@gauzy/contracts';
import { IntegrationTypeGetCommand } from '../integration-type.get.command';
import { IntegrationTypeService } from '../../integration-type.service';
export declare class IntegrationTypeGetHandler implements ICommandHandler<IntegrationTypeGetCommand> {
    private readonly _integrationTypeService;
    constructor(_integrationTypeService: IntegrationTypeService);
    /**
     * Executes the `IntegrationTypeGetCommand` to retrieve all integration types.
     *
     * @param {IntegrationTypeGetCommand} command - The command to fetch integration types (unused but kept for consistency).
     * @returns {Promise<IIntegrationType[]>} - A promise resolving to a list of integration types ordered by `order` in ascending order.
     *
     * @description
     * This method queries the database to fetch all integration types and sorts them by the `order` field in ascending order.
     *
     * @example
     * ```ts
     * const integrationTypes = await integrationTypeService.execute(new IntegrationTypeGetCommand());
     * console.log(integrationTypes);
     * ```
     */
    execute(command: IntegrationTypeGetCommand): Promise<IIntegrationType[]>;
}

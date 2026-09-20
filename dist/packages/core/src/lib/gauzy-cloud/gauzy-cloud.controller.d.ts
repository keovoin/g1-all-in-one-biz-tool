import { CommandBus } from '@nestjs/cqrs';
import { IOrganizationCreateInput, ITenantCreateInput, IUserRegistrationInput } from '@gauzy/contracts';
export declare class GauzyCloudController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    /**
     *
     * @param body
     * @returns
     */
    migrateUserToGauzyCloud(body: IUserRegistrationInput): Promise<any>;
    /**
     *
     * @param body
     * @param token
     * @returns
     */
    migrateTenantToGauzyCloud(body: ITenantCreateInput, token: string): Promise<any>;
    /**
     *
     * @param body
     * @param token
     * @returns
     */
    migrateOrganizationToGauzyCloud(body: IOrganizationCreateInput, token: string): Promise<any>;
}

import { ValidatorConstraintInterface } from 'class-validator';
import { ID, IOrganization } from '@gauzy/contracts';
import { TypeOrmUserOrganizationRepository } from '../../../user-organization/repository/type-orm-user-organization.repository';
import { MikroOrmUserOrganizationRepository } from '../../../user-organization/repository/mikro-orm-user-organization.repository';
/**
 * Validator constraint for checking if a user belongs to the organization.
 */
export declare class OrganizationBelongsToUserConstraint implements ValidatorConstraintInterface {
    readonly typeOrmUserOrganizationRepository: TypeOrmUserOrganizationRepository;
    readonly mikroOrmUserOrganizationRepository: MikroOrmUserOrganizationRepository;
    constructor(typeOrmUserOrganizationRepository: TypeOrmUserOrganizationRepository, mikroOrmUserOrganizationRepository: MikroOrmUserOrganizationRepository);
    /**
     * Validates if the user belongs to the organization.
     *
     * @param value - The organization ID or organization object.
     * @returns {Promise<boolean>} - True if the user belongs to the organization, otherwise false.
     */
    validate(value: ID | IOrganization): Promise<boolean>;
    /**
     * Checks if the given organization exists for the current user in the database.
     *
     * @param organizationId - The ID of the organization.
     * @returns {Promise<boolean>} - True if found, false otherwise.
     */
    checkOrganizationExistence(organizationId: string): Promise<boolean>;
    /**
     * Gets the default error message when validation fails.
     *
     * @returns {string} - Default error message.
     */
    defaultMessage(): string;
}

import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { IRole } from '@gauzy/contracts';
import { TypeOrmRoleRepository } from '../../../role/repository/type-orm-role.repository';
import { MikroOrmRoleRepository } from '../../../role/repository/mikro-orm-role.repository';
/**
 * Role should existed validation constraint
 *
 * @param validationOptions
 * @returns
 */
export declare class RoleShouldExistConstraint implements ValidatorConstraintInterface {
    readonly typeOrmRoleRepository: TypeOrmRoleRepository;
    readonly mikroOrmRoleRepository: MikroOrmRoleRepository;
    constructor(typeOrmRoleRepository: TypeOrmRoleRepository, mikroOrmRoleRepository: MikroOrmRoleRepository);
    /**
     * Validates if the given role exists for the current tenant.
     *
     * @param role - The role to validate, either as a string ID or an IRole object.
     * @returns True if the role exists, false otherwise.
     */
    validate(role: string | IRole): Promise<boolean>;
    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage(validationArguments?: ValidationArguments): string;
}

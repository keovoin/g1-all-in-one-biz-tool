"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAlreadyExistConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const request_context_1 = require("../../../core/context/request-context");
const utils_2 = require("../../../core/utils");
const type_orm_role_repository_1 = require("../../../role/repository/type-orm-role.repository");
const mikro_orm_role_repository_1 = require("../../../role/repository/mikro-orm-role.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_2.getORMType)();
/**
 * Role already existed validation constraint
 *
 * @param validationOptions
 * @returns
 */
let RoleAlreadyExistConstraint = class RoleAlreadyExistConstraint {
    constructor(typeOrmRoleRepository, mikroOrmRoleRepository) {
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.mikroOrmRoleRepository = mikroOrmRoleRepository;
    }
    /**
     * Validates if a role with the given name does not exist for the current tenant.
     *
     * @param name - The name of the role to validate.
     * @returns True if the role does not exist (passes validation), false otherwise.
     */
    async validate(name) {
        if ((0, utils_1.isEmpty)(name))
            return true;
        const tenantId = request_context_1.RequestContext.currentTenantId();
        try {
            switch (ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    return !(await this.mikroOrmRoleRepository.findOneOrFail({ name, tenantId }));
                case utils_2.MultiORMEnum.TypeORM:
                    return !(await this.typeOrmRoleRepository.findOneByOrFail({ name, tenantId }));
                default:
                    throw new Error(`Not implemented for ${ormType}`);
            }
        }
        catch (error) {
            // Check the specific error type (e.g., EntityNotFoundError) to ensure the error is due to the role not being found
            // Consider logging or handling other types of errors if necessary
            return true; // If the role is not found, validation passes
        }
    }
    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `The role name '${value}' is already in use. Please choose a unique name for the new role.`;
    }
};
exports.RoleAlreadyExistConstraint = RoleAlreadyExistConstraint;
exports.RoleAlreadyExistConstraint = RoleAlreadyExistConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsRoleAlreadyExist', async: true }),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository])
], RoleAlreadyExistConstraint);
//# sourceMappingURL=role-already-exist.constraint.js.map
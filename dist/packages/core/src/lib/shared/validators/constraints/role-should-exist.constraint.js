"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleShouldExistConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const context_1 = require("../../../core/context");
const utils_1 = require("../../../core/utils");
const type_orm_role_repository_1 = require("../../../role/repository/type-orm-role.repository");
const mikro_orm_role_repository_1 = require("../../../role/repository/mikro-orm-role.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_1.getORMType)();
/**
 * Role should existed validation constraint
 *
 * @param validationOptions
 * @returns
 */
let RoleShouldExistConstraint = class RoleShouldExistConstraint {
    constructor(typeOrmRoleRepository, mikroOrmRoleRepository) {
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.mikroOrmRoleRepository = mikroOrmRoleRepository;
    }
    /**
     * Validates if the given role exists for the current tenant.
     *
     * @param role - The role to validate, either as a string ID or an IRole object.
     * @returns True if the role exists, false otherwise.
     */
    async validate(role) {
        if (!role)
            return false;
        const roleId = typeof role === 'string' ? role : role.id;
        if (!roleId)
            return false;
        const tenantId = context_1.RequestContext.currentTenantId();
        // Reject validation when there is no tenant context.
        if (!tenantId) {
            return false;
        }
        try {
            switch (ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    return !!(await this.mikroOrmRoleRepository.findOneOrFail({ id: roleId, tenantId }));
                case utils_1.MultiORMEnum.TypeORM:
                    return !!(await this.typeOrmRoleRepository.findOneByOrFail({ id: roleId, tenantId }));
                default:
                    throw new Error(`Not implemented for ${ormType}`);
            }
        }
        catch (error) {
            return false; // Role does not exist
        }
    }
    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `Please provide a valid value for the role. The value '${JSON.stringify(value)}' is not recognized as a valid role identifier.`;
    }
};
exports.RoleShouldExistConstraint = RoleShouldExistConstraint;
exports.RoleShouldExistConstraint = RoleShouldExistConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsRoleShouldExist', async: true }),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository])
], RoleShouldExistConstraint);
//# sourceMappingURL=role-should-exist.constraint.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBelongsToUserConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../../../core/context");
const utils_2 = require("../../../core/utils");
const type_orm_user_organization_repository_1 = require("../../../user-organization/repository/type-orm-user-organization.repository");
const mikro_orm_user_organization_repository_1 = require("../../../user-organization/repository/mikro-orm-user-organization.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_2.getORMType)();
/**
 * Validator constraint for checking if a user belongs to the organization.
 */
let OrganizationBelongsToUserConstraint = class OrganizationBelongsToUserConstraint {
    constructor(typeOrmUserOrganizationRepository, mikroOrmUserOrganizationRepository) {
        this.typeOrmUserOrganizationRepository = typeOrmUserOrganizationRepository;
        this.mikroOrmUserOrganizationRepository = mikroOrmUserOrganizationRepository;
    }
    /**
     * Validates if the user belongs to the organization.
     *
     * @param value - The organization ID or organization object.
     * @returns {Promise<boolean>} - True if the user belongs to the organization, otherwise false.
     */
    async validate(value) {
        if ((0, utils_1.isEmpty)(value)) {
            return true;
        }
        const organizationId = typeof value === 'string' ? value : value.id;
        // Use the consolidated ORM logic function
        return this.checkOrganizationExistence(organizationId);
    }
    /**
     * Checks if the given organization exists for the current user in the database.
     *
     * @param organizationId - The ID of the organization.
     * @returns {Promise<boolean>} - True if found, false otherwise.
     */
    async checkOrganizationExistence(organizationId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const userId = context_1.RequestContext.currentUserId();
        if (!tenantId || !userId) {
            return false;
        }
        try {
            switch (ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    await this.mikroOrmUserOrganizationRepository.findOneOrFail({
                        tenantId,
                        userId,
                        organizationId
                    });
                    return true;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    await this.typeOrmUserOrganizationRepository.findOneByOrFail({
                        tenantId,
                        userId,
                        organizationId
                    });
                    return true;
                }
                default:
                    throw new Error(`ORM type "${ormType}" not implemented.`);
            }
        }
        catch {
            return false;
        }
    }
    /**
     * Gets the default error message when validation fails.
     *
     * @returns {string} - Default error message.
     */
    defaultMessage() {
        const userId = context_1.RequestContext.currentUserId();
        return `The user with ID ${userId} is not associated with the specified organization.`;
    }
};
exports.OrganizationBelongsToUserConstraint = OrganizationBelongsToUserConstraint;
exports.OrganizationBelongsToUserConstraint = OrganizationBelongsToUserConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsOrganizationBelongsToUser', async: true }),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_organization_repository_1.TypeOrmUserOrganizationRepository,
        mikro_orm_user_organization_repository_1.MikroOrmUserOrganizationRepository])
], OrganizationBelongsToUserConstraint);
//# sourceMappingURL=organization-belongs-to-user.constraint.js.map
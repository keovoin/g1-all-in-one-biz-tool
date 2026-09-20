"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAlreadyExistConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../../../core/context");
const utils_2 = require("../../../core/utils");
const type_orm_organization_team_repository_1 = require("../../../organization-team/repository/type-orm-organization-team.repository");
const mikro_orm_organization_team_repository_1 = require("../../../organization-team/repository/mikro-orm-organization-team.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_2.getORMType)();
let TeamAlreadyExistConstraint = class TeamAlreadyExistConstraint {
    constructor(typeOrmOrganizationTeamRepository, mikroOrmOrganizationTeamRepository) {
        this.typeOrmOrganizationTeamRepository = typeOrmOrganizationTeamRepository;
        this.mikroOrmOrganizationTeamRepository = mikroOrmOrganizationTeamRepository;
    }
    /**
     * Validates if a given name is not already in use in the specified organization.
     *
     * @param name - The name to validate.
     * @param args - Validation arguments, expected to contain organization ID and tenant ID.
     * @returns True if the name is not in use or if there's no organization ID, false otherwise.
     */
    async validate(name, args) {
        if ((0, utils_1.isEmpty)(name)) {
            return true; // Empty value is considered valid
        }
        const payload = args.object;
        const organizationId = payload.organizationId || payload.organization?.id;
        if (!organizationId) {
            return true; // Validation is irrelevant without an organization ID
        }
        const tenantId = context_1.RequestContext.currentTenantId();
        const queryConditions = { name, organizationId, tenantId };
        if (payload.id) {
            queryConditions.id = (0, typeorm_1.Not)(payload.id); // Exclude current entity from check
        }
        try {
            switch (ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)({
                        where: queryConditions
                    });
                    return !(await this.mikroOrmOrganizationTeamRepository.findOneOrFail(where, mikroOptions));
                case utils_2.MultiORMEnum.TypeORM:
                    return !(await this.typeOrmOrganizationTeamRepository.findOneByOrFail(queryConditions));
                default:
                    throw new Error(`Not implemented for ${ormType}`);
            }
        }
        catch (error) {
            return true; // No existing team found, hence valid
        }
    }
    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `The team name '${value}' is already in use. Please choose a different name.`;
    }
};
exports.TeamAlreadyExistConstraint = TeamAlreadyExistConstraint;
exports.TeamAlreadyExistConstraint = TeamAlreadyExistConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsTeamAlreadyExist', async: true }),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_team_repository_1.TypeOrmOrganizationTeamRepository,
        mikro_orm_organization_team_repository_1.MikroOrmOrganizationTeamRepository])
], TeamAlreadyExistConstraint);
//# sourceMappingURL=team-already-exist.constraint.js.map
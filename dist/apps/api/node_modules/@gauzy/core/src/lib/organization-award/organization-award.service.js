"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationAwardService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_organization_award_repository_1 = require("./repository/mikro-orm-organization-award.repository");
const type_orm_organization_award_repository_1 = require("./repository/type-orm-organization-award.repository");
let OrganizationAwardService = class OrganizationAwardService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationAwardRepository, mikroOrmOrganizationAwardRepository) {
        super(typeOrmOrganizationAwardRepository, mikroOrmOrganizationAwardRepository);
    }
};
exports.OrganizationAwardService = OrganizationAwardService;
exports.OrganizationAwardService = OrganizationAwardService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_award_repository_1.TypeOrmOrganizationAwardRepository,
        mikro_orm_organization_award_repository_1.MikroOrmOrganizationAwardRepository])
], OrganizationAwardService);
//# sourceMappingURL=organization-award.service.js.map
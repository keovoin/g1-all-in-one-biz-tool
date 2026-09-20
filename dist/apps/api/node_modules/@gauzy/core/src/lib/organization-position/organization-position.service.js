"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPositionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_organization_position_repository_1 = require("./repository/type-orm-organization-position.repository");
const mikro_orm_organization_position_repository_1 = require("./repository/mikro-orm-organization-position.repository");
let OrganizationPositionService = class OrganizationPositionService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationPositionRepository, mikroOrmOrganizationPositionRepository) {
        super(typeOrmOrganizationPositionRepository, mikroOrmOrganizationPositionRepository);
    }
};
exports.OrganizationPositionService = OrganizationPositionService;
exports.OrganizationPositionService = OrganizationPositionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_position_repository_1.TypeOrmOrganizationPositionRepository,
        mikro_orm_organization_position_repository_1.MikroOrmOrganizationPositionRepository])
], OrganizationPositionService);
//# sourceMappingURL=organization-position.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationLanguageService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_organization_language_repository_1 = require("./repository/type-orm-organization-language.repository");
const mikro_orm_organization_language_repository_1 = require("./repository/mikro-orm-organization-language.repository");
let OrganizationLanguageService = class OrganizationLanguageService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationLanguageRepository, mikroOrmOrganizationLanguageRepository) {
        super(typeOrmOrganizationLanguageRepository, mikroOrmOrganizationLanguageRepository);
    }
};
exports.OrganizationLanguageService = OrganizationLanguageService;
exports.OrganizationLanguageService = OrganizationLanguageService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_language_repository_1.TypeOrmOrganizationLanguageRepository,
        mikro_orm_organization_language_repository_1.MikroOrmOrganizationLanguageRepository])
], OrganizationLanguageService);
//# sourceMappingURL=organization-language.service.js.map
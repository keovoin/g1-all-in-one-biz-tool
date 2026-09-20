"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const type_orm_integration_repository_1 = require("./repository/type-orm-integration.repository");
const mikro_orm_integration_repository_1 = require("./repository/mikro-orm-integration.repository");
let IntegrationService = class IntegrationService extends crud_1.CrudService {
    constructor(typeOrmIntegrationRepository, mikroOrmIntegrationRepository) {
        super(typeOrmIntegrationRepository, mikroOrmIntegrationRepository);
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_repository_1.TypeOrmIntegrationRepository,
        mikro_orm_integration_repository_1.MikroOrmIntegrationRepository])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map
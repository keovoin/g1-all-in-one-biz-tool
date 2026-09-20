"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const type_orm_integration_map_repository_1 = require("./repository/type-orm-integration-map.repository");
const mikro_orm_integration_map_repository_1 = require("./repository/mikro-orm-integration-map.repository");
let IntegrationMapService = class IntegrationMapService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmIntegrationMapRepository, mikroOrmIntegrationMapRepository) {
        super(typeOrmIntegrationMapRepository, mikroOrmIntegrationMapRepository);
    }
};
exports.IntegrationMapService = IntegrationMapService;
exports.IntegrationMapService = IntegrationMapService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_map_repository_1.TypeOrmIntegrationMapRepository,
        mikro_orm_integration_map_repository_1.MikroOrmIntegrationMapRepository])
], IntegrationMapService);
//# sourceMappingURL=integration-map.service.js.map
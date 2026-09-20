"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const type_orm_integration_type_repository_1 = require("./repository/type-orm-integration-type.repository");
const mikro_orm_integration_type_repository_1 = require("./repository/mikro-orm-integration-type.repository");
let IntegrationTypeService = class IntegrationTypeService extends crud_1.CrudService {
    constructor(typeOrmIntegrationTypeRepository, mikroOrmIntegrationTypeRepository) {
        super(typeOrmIntegrationTypeRepository, mikroOrmIntegrationTypeRepository);
    }
};
exports.IntegrationTypeService = IntegrationTypeService;
exports.IntegrationTypeService = IntegrationTypeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_type_repository_1.TypeOrmIntegrationTypeRepository,
        mikro_orm_integration_type_repository_1.MikroOrmIntegrationTypeRepository])
], IntegrationTypeService);
//# sourceMappingURL=integration-type.service.js.map
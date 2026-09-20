"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../../core/crud");
const type_orm_estimation_repository_1 = require("./repository/type-orm-estimation.repository");
const mikro_orm_estimation_repository_1 = require("./repository/mikro-orm-estimation.repository");
let TaskEstimationService = class TaskEstimationService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTaskEstimationRepository, mikroOrmTaskEstimationRepository) {
        super(typeOrmTaskEstimationRepository, mikroOrmTaskEstimationRepository);
    }
};
exports.TaskEstimationService = TaskEstimationService;
exports.TaskEstimationService = TaskEstimationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_estimation_repository_1.TypeOrmTaskEstimationRepository,
        mikro_orm_estimation_repository_1.MikroOrmTaskEstimationRepository])
], TaskEstimationService);
//# sourceMappingURL=task-estimation.service.js.map
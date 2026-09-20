"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimRepositoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const type_orm_sim_workflow_execution_repository_1 = require("./repository/type-orm-sim-workflow-execution.repository");
const mikro_orm_sim_workflow_execution_repository_1 = require("./repository/mikro-orm-sim-workflow-execution.repository");
let SimRepositoryService = class SimRepositoryService extends core_1.TenantAwareCrudService {
    constructor(typeOrmSimWorkflowExecutionRepository, mikroOrmSimWorkflowExecutionRepository) {
        super(typeOrmSimWorkflowExecutionRepository, mikroOrmSimWorkflowExecutionRepository);
        this.typeOrmSimWorkflowExecutionRepository = typeOrmSimWorkflowExecutionRepository;
        this.mikroOrmSimWorkflowExecutionRepository = mikroOrmSimWorkflowExecutionRepository;
    }
};
exports.SimRepositoryService = SimRepositoryService;
exports.SimRepositoryService = SimRepositoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_sim_workflow_execution_repository_1.TypeOrmSimWorkflowExecutionRepository,
        mikro_orm_sim_workflow_execution_repository_1.MikroOrmSimWorkflowExecutionRepository])
], SimRepositoryService);
//# sourceMappingURL=sim-repository.service.js.map
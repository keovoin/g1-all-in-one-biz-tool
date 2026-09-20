"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmSimWorkflowExecutionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sim_workflow_execution_entity_1 = require("../sim-workflow-execution.entity");
let TypeOrmSimWorkflowExecutionRepository = class TypeOrmSimWorkflowExecutionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmSimWorkflowExecutionRepository = TypeOrmSimWorkflowExecutionRepository;
exports.TypeOrmSimWorkflowExecutionRepository = TypeOrmSimWorkflowExecutionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(sim_workflow_execution_entity_1.SimWorkflowExecution)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmSimWorkflowExecutionRepository);
//# sourceMappingURL=type-orm-sim-workflow-execution.repository.js.map
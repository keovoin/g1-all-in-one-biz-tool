"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmScreeningTaskRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screening_task_entity_1 = require("../screening-task.entity");
let TypeOrmScreeningTaskRepository = class TypeOrmScreeningTaskRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmScreeningTaskRepository = TypeOrmScreeningTaskRepository;
exports.TypeOrmScreeningTaskRepository = TypeOrmScreeningTaskRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(screening_task_entity_1.ScreeningTask)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmScreeningTaskRepository);
//# sourceMappingURL=type-orm-screening-task.repository.js.map
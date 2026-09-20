"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTaskRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../task.entity");
let TypeOrmTaskRepository = class TypeOrmTaskRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTaskRepository = TypeOrmTaskRepository;
exports.TypeOrmTaskRepository = TypeOrmTaskRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTaskRepository);
//# sourceMappingURL=type-orm-task.repository.js.map
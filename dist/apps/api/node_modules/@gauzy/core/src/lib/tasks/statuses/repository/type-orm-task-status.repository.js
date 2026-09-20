"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTaskStatusRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const status_entity_1 = require("../status.entity");
let TypeOrmTaskStatusRepository = class TypeOrmTaskStatusRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTaskStatusRepository = TypeOrmTaskStatusRepository;
exports.TypeOrmTaskStatusRepository = TypeOrmTaskStatusRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(status_entity_1.TaskStatus)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTaskStatusRepository);
//# sourceMappingURL=type-orm-task-status.repository.js.map
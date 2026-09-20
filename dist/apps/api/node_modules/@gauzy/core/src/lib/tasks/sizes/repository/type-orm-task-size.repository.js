"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTaskSizeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const size_entity_1 = require("../size.entity");
let TypeOrmTaskSizeRepository = class TypeOrmTaskSizeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTaskSizeRepository = TypeOrmTaskSizeRepository;
exports.TypeOrmTaskSizeRepository = TypeOrmTaskSizeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(size_entity_1.TaskSize)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTaskSizeRepository);
//# sourceMappingURL=type-orm-task-size.repository.js.map
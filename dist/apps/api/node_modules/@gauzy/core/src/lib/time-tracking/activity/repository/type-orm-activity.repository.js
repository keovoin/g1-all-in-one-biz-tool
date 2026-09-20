"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmActivityRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("../activity.entity");
let TypeOrmActivityRepository = class TypeOrmActivityRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmActivityRepository = TypeOrmActivityRepository;
exports.TypeOrmActivityRepository = TypeOrmActivityRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmActivityRepository);
//# sourceMappingURL=type-orm-activity.repository.js.map
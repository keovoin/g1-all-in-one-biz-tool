"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmActivityLogRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("../activity-log.entity");
let TypeOrmActivityLogRepository = class TypeOrmActivityLogRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmActivityLogRepository = TypeOrmActivityLogRepository;
exports.TypeOrmActivityLogRepository = TypeOrmActivityLogRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmActivityLogRepository);
//# sourceMappingURL=type-orm-activity-log.repository.js.map
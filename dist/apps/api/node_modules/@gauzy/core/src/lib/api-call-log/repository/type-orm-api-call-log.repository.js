"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmApiCallLogRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const api_call_log_entity_1 = require("../api-call-log.entity");
let TypeOrmApiCallLogRepository = class TypeOrmApiCallLogRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmApiCallLogRepository = TypeOrmApiCallLogRepository;
exports.TypeOrmApiCallLogRepository = TypeOrmApiCallLogRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(api_call_log_entity_1.ApiCallLog)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmApiCallLogRepository);
//# sourceMappingURL=type-orm-api-call-log.repository.js.map
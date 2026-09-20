"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTimeOffRequestRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_off_request_entity_1 = require("../time-off-request.entity");
let TypeOrmTimeOffRequestRepository = class TypeOrmTimeOffRequestRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTimeOffRequestRepository = TypeOrmTimeOffRequestRepository;
exports.TypeOrmTimeOffRequestRepository = TypeOrmTimeOffRequestRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(time_off_request_entity_1.TimeOffRequest)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTimeOffRequestRepository);
//# sourceMappingURL=type-orm-time-off-request.repository.js.map
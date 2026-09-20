"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmApprovalPolicyRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const approval_policy_entity_1 = require("../approval-policy.entity");
let TypeOrmApprovalPolicyRepository = class TypeOrmApprovalPolicyRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmApprovalPolicyRepository = TypeOrmApprovalPolicyRepository;
exports.TypeOrmApprovalPolicyRepository = TypeOrmApprovalPolicyRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(approval_policy_entity_1.ApprovalPolicy)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmApprovalPolicyRepository);
//# sourceMappingURL=type-orm-approval-policy.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRequestApprovalEmployeeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_approval_employee_entity_1 = require("../request-approval-employee.entity");
let TypeOrmRequestApprovalEmployeeRepository = class TypeOrmRequestApprovalEmployeeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmRequestApprovalEmployeeRepository = TypeOrmRequestApprovalEmployeeRepository;
exports.TypeOrmRequestApprovalEmployeeRepository = TypeOrmRequestApprovalEmployeeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(request_approval_employee_entity_1.RequestApprovalEmployee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmRequestApprovalEmployeeRepository);
//# sourceMappingURL=type-orm-request-approval-employee.repository.js.map
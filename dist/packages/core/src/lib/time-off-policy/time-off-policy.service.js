"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffPolicyService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const utils_1 = require("../core/utils");
const mikro_orm_employee_repository_1 = require("../employee/repository/mikro-orm-employee.repository");
const type_orm_employee_repository_1 = require("../employee/repository/type-orm-employee.repository");
const mikro_orm_time_off_policy_repository_1 = require("./repository/mikro-orm-time-off-policy.repository");
const type_orm_time_off_policy_repository_1 = require("./repository/type-orm-time-off-policy.repository");
const time_off_policy_entity_1 = require("./time-off-policy.entity");
let TimeOffPolicyService = class TimeOffPolicyService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimeOffPolicyRepository, mikroOrmTimeOffPolicyRepository, typeOrmEmployeeRepository, mikroOrmEmployeeRepository) {
        super(typeOrmTimeOffPolicyRepository, mikroOrmTimeOffPolicyRepository);
        this.typeOrmTimeOffPolicyRepository = typeOrmTimeOffPolicyRepository;
        this.mikroOrmTimeOffPolicyRepository = mikroOrmTimeOffPolicyRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.mikroOrmEmployeeRepository = mikroOrmEmployeeRepository;
    }
    /**
     * Create Time Off Policy
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() || entity.tenantId;
            const organizationId = entity.organizationId;
            const policy = new time_off_policy_entity_1.TimeOffPolicy();
            policy.name = entity.name;
            policy.organizationId = organizationId;
            policy.tenantId = tenantId;
            policy.requiresApproval = entity.requiresApproval;
            policy.paid = entity.paid;
            policy.leaveType = entity.leaveType;
            policy.maxDaysPerYear = entity.maxDaysPerYear;
            policy.allowCarryForward = entity.allowCarryForward;
            policy.maxCarryForwardDays = entity.maxCarryForwardDays;
            policy.accrualRate = entity.accrualRate;
            policy.accrualFrequency = entity.accrualFrequency;
            policy.isDefault = entity.isDefault;
            // Find employees
            let employees;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    employees = await this.mikroOrmEmployeeRepository.find({ id: { $in: entity.employees }, tenantId, organizationId }, { populate: ['user'] });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    employees = await this.typeOrmEmployeeRepository.find({
                        where: { id: (0, typeorm_1.In)(entity.employees), tenantId, organizationId },
                        relations: { user: true }
                    });
                    break;
            }
            policy.employees = employees;
            // Save the policy
            return await this.save(policy);
        }
        catch (error) {
            throw new common_1.HttpException(`Error while creating time-off policy: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Update Time Off Policy
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() || entity.tenantId;
            const organizationId = entity.organizationId;
            // The body is not DTO-validated: an empty organizationId would scope the employee lookup
            // below to nothing (null -> IS NULL). Require it.
            if (!organizationId) {
                throw new common_1.HttpException('organizationId is required', common_1.HttpStatus.BAD_REQUEST);
            }
            // Edit the existing row rather than deleting it and inserting a replacement. The old
            // implementation issued a real DELETE and then saved a NEW policy with a NEW id, which
            // (a) detached every `time_off_request` that pointed at the policy — `policyId` is
            // `ON DELETE SET NULL` — and (b) would now cascade-delete the policy's whole
            // `time_off_balance` ledger. It also handed callers back an id they never asked for.
            const policy = await this.findOneByWhereOptions({ id, tenantId, organizationId });
            policy.name = entity.name;
            policy.requiresApproval = entity.requiresApproval;
            policy.paid = entity.paid;
            policy.leaveType = entity.leaveType;
            policy.maxDaysPerYear = entity.maxDaysPerYear;
            policy.allowCarryForward = entity.allowCarryForward;
            policy.maxCarryForwardDays = entity.maxCarryForwardDays;
            policy.accrualRate = entity.accrualRate;
            policy.accrualFrequency = entity.accrualFrequency;
            policy.isDefault = entity.isDefault;
            let employees;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    employees = await this.mikroOrmEmployeeRepository.find({ id: { $in: entity.employees }, tenantId, organizationId }, { populate: ['user'] });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    employees = await this.typeOrmEmployeeRepository.find({
                        where: { id: (0, typeorm_1.In)(entity.employees), tenantId, organizationId },
                        relations: { user: true }
                    });
                    break;
            }
            policy.employees = employees;
            // Save the policy
            return await this.save(policy);
        }
        catch (error) {
            throw new common_1.HttpException(`Error while updating time-off policy: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TimeOffPolicyService = TimeOffPolicyService;
exports.TimeOffPolicyService = TimeOffPolicyService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_off_policy_repository_1.TypeOrmTimeOffPolicyRepository,
        mikro_orm_time_off_policy_repository_1.MikroOrmTimeOffPolicyRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository])
], TimeOffPolicyService);
//# sourceMappingURL=time-off-policy.service.js.map
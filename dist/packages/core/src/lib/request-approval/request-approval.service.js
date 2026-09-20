"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const database_helper_1 = require("./../database/database.helper");
const context_1 = require("../core/context");
const internal_1 = require("./../core/entities/internal");
const crud_1 = require("./../core/crud");
const sensitive_relations_helper_1 = require("./../core/util/sensitive-relations.helper");
const utils_1 = require("./../core/utils");
const request_approval_entity_1 = require("./request-approval.entity");
const mikro_orm_request_approval_repository_1 = require("./repository/mikro-orm-request-approval.repository");
const type_orm_request_approval_repository_1 = require("./repository/type-orm-request-approval.repository");
const type_orm_employee_repository_1 = require("../employee/repository/type-orm-employee.repository");
const mikro_orm_employee_repository_1 = require("../employee/repository/mikro-orm-employee.repository");
const type_orm_organization_team_repository_1 = require("../organization-team/repository/type-orm-organization-team.repository");
const mikro_orm_organization_team_repository_1 = require("../organization-team/repository/mikro-orm-organization-team.repository");
let RequestApprovalService = class RequestApprovalService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmRequestApprovalRepository, mikroOrmRequestApprovalRepository, typeOrmEmployeeRepository, mikroOrmEmployeeRepository, typeOrmOrganizationTeamRepository, mikroOrmOrganizationTeamRepository) {
        super(typeOrmRequestApprovalRepository, mikroOrmRequestApprovalRepository);
        this.typeOrmRequestApprovalRepository = typeOrmRequestApprovalRepository;
        this.mikroOrmRequestApprovalRepository = mikroOrmRequestApprovalRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.mikroOrmEmployeeRepository = mikroOrmEmployeeRepository;
        this.typeOrmOrganizationTeamRepository = typeOrmOrganizationTeamRepository;
        this.mikroOrmOrganizationTeamRepository = mikroOrmOrganizationTeamRepository;
    }
    async findAllRequestApprovals(filter, findInput) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(filter);
        const tenantId = context_1.RequestContext.currentTenantId();
        const { organizationId } = findInput;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmRequestApprovalRepository.getKnex();
                const query = knex('request_approval')
                    .withSchema(knex.userParams.schema)
                    .as('request_approval')
                    .select('request_approval.id');
                // Polymorphic join logic mirroring TypeORM implementation
                const timeOffRequestCheckIdQuery = `${(0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                    ? '"time_off_request"."id" = "request_approval"."requestId"'
                    : (0, config_1.isPostgres)()
                        ? '"time_off_request"."id"::text = "request_approval"."requestId"'
                        : (0, config_1.isMySQL)()
                            ? 'CAST("time_off_request"."id" AS CHAR) = "request_approval"."requestId"'
                            : '"time_off_request"."id" = "request_approval"."requestId"'}`;
                const equipmentSharingCheckIdQuery = `${(0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                    ? '"equipment_sharing"."id" = "request_approval"."requestId"'
                    : (0, config_1.isPostgres)()
                        ? '"equipment_sharing"."id"::text = "request_approval"."requestId"'
                        : (0, config_1.isMySQL)()
                            ? 'CAST("equipment_sharing"."id" AS CHAR) = "request_approval"."requestId"'
                            : '"equipment_sharing"."id" = "request_approval"."requestId"'}`;
                query.leftJoin('approval_policy', 'approval_policy', 'approval_policy.id', 'request_approval.approvalPolicyId');
                query.leftJoin('time_off_request', (join) => join.on(knex.raw(timeOffRequestCheckIdQuery)));
                query.leftJoin('equipment_sharing', (join) => join.on(knex.raw(equipmentSharingCheckIdQuery)));
                query.where((qb) => {
                    qb.where({ 'approval_policy.organizationId': organizationId, 'approval_policy.tenantId': tenantId })
                        .orWhere({
                        'time_off_request.organizationId': organizationId,
                        'time_off_request.tenantId': tenantId
                    })
                        .orWhere({
                        'equipment_sharing.organizationId': organizationId,
                        'equipment_sharing.tenantId': tenantId
                    });
                });
                const results = await query;
                const ids = results.map((r) => r.id);
                if (ids.length === 0) {
                    return { items: [], total: 0 };
                }
                const relations = filter.relations;
                const [items, total] = await this.mikroOrmRepository.findAndCount({ id: { $in: ids } }, {
                    ...(relations && relations.length > 0 ? { populate: relations } : {})
                });
                return { items: items.map((e) => this.serialize(e)), total };
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder('request_approval');
                query.leftJoinAndSelect(`${query.alias}.approvalPolicy`, 'approvalPolicy');
                const timeOffRequestCheckIdQuery = `${(0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                    ? '"time_off_request"."id" = "request_approval"."requestId"'
                    : (0, config_1.isPostgres)()
                        ? '"time_off_request"."id"::"varchar" = "request_approval"."requestId"'
                        : (0, config_1.isMySQL)()
                            ? (0, database_helper_1.prepareSQLQuery)(`CAST("time_off_request"."id" AS CHAR) COLLATE utf8mb4_unicode_ci = "request_approval"."requestId" COLLATE utf8mb4_unicode_ci`)
                            : '"time_off_request"."id" = "request_approval"."requestId"'}`;
                const equipmentSharingCheckIdQuery = `${(0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()
                    ? '"equipment_sharing"."id" = "request_approval"."requestId"'
                    : (0, config_1.isPostgres)()
                        ? '"equipment_sharing"."id"::"varchar" = "request_approval"."requestId"'
                        : (0, config_1.isMySQL)()
                            ? (0, database_helper_1.prepareSQLQuery)(`CAST(CONVERT("time_off_request"."id" USING utf8mb4) AS CHAR) = CAST(CONVERT("request_approval"."requestId" USING utf8mb4) AS CHAR)`)
                            : '"equipment_sharing"."id" = "request_approval"."requestId"'}`;
                query.leftJoinAndSelect('time_off_request', 'time_off_request', timeOffRequestCheckIdQuery);
                query.leftJoinAndSelect('equipment_sharing', 'equipment_sharing', equipmentSharingCheckIdQuery);
                const relations = filter.relations;
                if (relations && relations.length > 0) {
                    query.setFindOptions({ relations: (0, utils_1.parseFindOptionsRelations)(relations) });
                }
                const [items, total] = await query
                    .where(new typeorm_1.Brackets((sqb) => {
                    sqb.where((0, database_helper_1.prepareSQLQuery)('approvalPolicy.organizationId =:organizationId'), {
                        organizationId
                    }).andWhere((0, database_helper_1.prepareSQLQuery)('approvalPolicy.tenantId =:tenantId'), {
                        tenantId
                    });
                }))
                    .orWhere(new typeorm_1.Brackets((sqb) => {
                    sqb.where((0, database_helper_1.prepareSQLQuery)('time_off_request.organizationId =:organizationId'), {
                        organizationId
                    }).andWhere((0, database_helper_1.prepareSQLQuery)('time_off_request.tenantId =:tenantId'), {
                        tenantId
                    });
                }))
                    .orWhere(new typeorm_1.Brackets((sqb) => {
                    sqb.where((0, database_helper_1.prepareSQLQuery)('equipment_sharing.organizationId =:organizationId'), {
                        organizationId
                    }).andWhere((0, database_helper_1.prepareSQLQuery)('equipment_sharing.tenantId =:tenantId'), {
                        tenantId
                    });
                }))
                    .getManyAndCount();
                return { items, total };
            }
        }
    }
    async findRequestApprovalsByEmployeeId(id, relations, findInput) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        // The relations are applied to the EMPLOYEE read below, so the table is walked from `Employee`.
        (0, sensitive_relations_helper_1.assertSensitiveRelationsAllowed)(this.typeOrmEmployeeRepository.metadata, relations);
        // Get the current tenant ID and current user ID from the request context.
        const currentUserId = context_1.RequestContext.currentUserId();
        const tenantId = context_1.RequestContext.currentTenantId();
        const { organizationId } = findInput;
        const result = await this.find({
            where: {
                createdByUserId: currentUserId,
                organizationId,
                tenantId
            }
        });
        let requestApproval = [];
        let employee;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM:
                employee = await this.mikroOrmEmployeeRepository.findOne(id, {
                    populate: relations
                });
                break;
            case utils_1.MultiORMEnum.TypeORM:
            default:
                employee = await this.typeOrmEmployeeRepository.findOne({
                    where: { id },
                    relations: (0, utils_1.parseFindOptionsRelations)(relations)
                });
                break;
        }
        if (employee && employee.requestApprovals && employee.requestApprovals.length > 0) {
            requestApproval = [...requestApproval, ...employee.requestApprovals];
        }
        for (const request of requestApproval) {
            const approval = await this.findOneByOptions({
                where: {
                    id: request.requestApprovalId
                },
                relations: {
                    approvalPolicy: true,
                    employeeApprovals: true,
                    teamApprovals: true,
                    tags: true
                }
            });
            result.push(approval);
        }
        return { items: result, total: result.length };
    }
    /**
     * Creates a RequestApproval record.
     *
     * @param entity - The input data to create a RequestApproval.
     * @returns The saved RequestApproval entity.
     */
    async createRequestApproval(entity) {
        // Get the current tenant ID and current user ID from the request context.
        const tenantId = context_1.RequestContext.currentTenantId();
        const requestApproval = new request_approval_entity_1.RequestApproval();
        requestApproval.status = contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
        requestApproval.approvalPolicyId = entity.approvalPolicyId;
        requestApproval.name = entity.name;
        requestApproval.min_count = entity.min_count;
        requestApproval.tags = entity.tags;
        requestApproval.organizationId = entity.organizationId;
        requestApproval.tenantId = tenantId;
        if (entity.employeeApprovals?.length) {
            let employees;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    employees = await this.mikroOrmEmployeeRepository.find({
                        id: { $in: entity.employeeApprovals }
                    });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    employees = await this.typeOrmEmployeeRepository.find({
                        where: { id: (0, typeorm_1.In)(entity.employeeApprovals) }
                    });
                    break;
            }
            requestApproval.employeeApprovals = employees.map((employee) => {
                const requestApprovalEmployee = new internal_1.RequestApprovalEmployee();
                requestApprovalEmployee.employeeId = employee.id;
                requestApprovalEmployee.organizationId = entity.organizationId;
                requestApprovalEmployee.tenantId = tenantId;
                requestApprovalEmployee.status = contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
                return requestApprovalEmployee;
            });
        }
        if (entity.teams?.length) {
            let teams;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    teams = await this.mikroOrmOrganizationTeamRepository.find({ id: { $in: entity.teams } });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    teams = await this.typeOrmOrganizationTeamRepository.find({
                        where: { id: (0, typeorm_1.In)(entity.teams) }
                    });
                    break;
            }
            requestApproval.teamApprovals = teams.map((team) => {
                const requestApprovalTeam = new internal_1.RequestApprovalTeam();
                requestApprovalTeam.teamId = team.id;
                requestApprovalTeam.team = team;
                requestApprovalTeam.status = contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
                requestApprovalTeam.organizationId = entity.organizationId;
                requestApprovalTeam.tenantId = tenantId;
                return requestApprovalTeam;
            });
        }
        return this.save(requestApproval);
    }
    async updateRequestApproval(id, entity) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const requestApproval = await this.findOneByIdString(id);
        requestApproval.name = entity.name;
        requestApproval.status = contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
        requestApproval.approvalPolicyId = entity.approvalPolicyId;
        requestApproval.min_count = entity.min_count;
        requestApproval.tags = entity.tags;
        requestApproval.organizationId = entity.organizationId;
        requestApproval.tenantId = tenantId;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use nativeDelete on the entity manager
                const em = this.mikroOrmRepository.getEntityManager();
                await em.nativeDelete(internal_1.RequestApprovalEmployee, { requestApprovalId: id });
                await em.nativeDelete(internal_1.RequestApprovalTeam, { requestApprovalId: id });
                break;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                await this.typeOrmRepository
                    .createQueryBuilder()
                    .delete()
                    .from(internal_1.RequestApprovalEmployee)
                    .where((0, database_helper_1.prepareSQLQuery)('requestApprovalId = :id'), { id: id })
                    .execute();
                await this.typeOrmRepository
                    .createQueryBuilder()
                    .delete()
                    .from(internal_1.RequestApprovalTeam)
                    .where((0, database_helper_1.prepareSQLQuery)('requestApprovalId = :id'), { id: id })
                    .execute();
                break;
            }
        }
        if (entity.employeeApprovals) {
            let employees;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    employees = await this.mikroOrmEmployeeRepository.find({
                        id: { $in: entity.employeeApprovals }
                    });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    employees = await this.typeOrmEmployeeRepository.find({
                        where: {
                            id: (0, typeorm_1.In)(entity.employeeApprovals)
                        }
                    });
                    break;
            }
            const requestApprovalEmployees = [];
            employees.forEach((employee) => {
                const raEmployees = new internal_1.RequestApprovalEmployee();
                raEmployees.employeeId = employee.id;
                raEmployees.employee = employee;
                raEmployees.organizationId = entity.organizationId;
                raEmployees.tenantId = tenantId;
                raEmployees.status = contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
                requestApprovalEmployees.push(raEmployees);
            });
            requestApproval.employeeApprovals = requestApprovalEmployees;
        }
        if (entity.teams) {
            let teams;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    teams = await this.mikroOrmOrganizationTeamRepository.find({ id: { $in: entity.teams } });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    teams = await this.typeOrmOrganizationTeamRepository.find({
                        where: {
                            id: (0, typeorm_1.In)(entity.teams)
                        }
                    });
                    break;
            }
            const requestApprovalTeams = [];
            teams.forEach((team) => {
                const raTeam = new internal_1.RequestApprovalTeam();
                raTeam.teamId = team.id;
                raTeam.team = team;
                raTeam.status = contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
                raTeam.organizationId = entity.organizationId;
                raTeam.tenantId = tenantId;
                requestApprovalTeams.push(raTeam);
            });
            requestApproval.teamApprovals = requestApprovalTeams;
        }
        return this.save(requestApproval);
    }
    async updateStatusRequestApprovalByAdmin(id, status) {
        const requestApproval = await this.findOneByIdString(id, {
            relations: {
                approvalPolicy: true
            }
        });
        // if (
        // 	requestApproval.status ===
        // 		RequestApprovalStatusTypesEnum.APPROVED ||
        // 	requestApproval.status ===
        // 		RequestApprovalStatusTypesEnum.REFUSED
        // ) {
        // 	throw new ConflictException('Request Approval is Conflict');
        // }
        requestApproval.status = status;
        return this.save(requestApproval);
    }
    async updateStatusRequestApprovalByEmployeeOrTeam(id, status) {
        let minCount = 0;
        const employeeId = context_1.RequestContext.currentUser().employeeId;
        const requestApproval = await this.findOneByIdString(id, {
            relations: {
                employeeApprovals: true,
                teamApprovals: true
            }
        });
        if (requestApproval.status === contracts_1.RequestApprovalStatusTypesEnum.APPROVED ||
            requestApproval.status === contracts_1.RequestApprovalStatusTypesEnum.REFUSED) {
            throw new common_1.ConflictException('Request Approval is Conflict');
        }
        if (requestApproval.employeeApprovals && requestApproval.employeeApprovals.length > 0) {
            requestApproval.employeeApprovals.forEach((req) => {
                if (req.employeeId === employeeId) {
                    req.status = status;
                }
                if (req.status === contracts_1.RequestApprovalStatusTypesEnum.APPROVED) {
                    minCount++;
                }
            });
        }
        if (status === contracts_1.RequestApprovalStatusTypesEnum.REFUSED) {
            requestApproval.status = contracts_1.RequestApprovalStatusTypesEnum.REFUSED;
        }
        else if (minCount >= requestApproval.min_count) {
            requestApproval.status = contracts_1.RequestApprovalStatusTypesEnum.APPROVED;
        }
        return this.save(requestApproval);
    }
};
exports.RequestApprovalService = RequestApprovalService;
exports.RequestApprovalService = RequestApprovalService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository,
        mikro_orm_request_approval_repository_1.MikroOrmRequestApprovalRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
        type_orm_organization_team_repository_1.TypeOrmOrganizationTeamRepository,
        mikro_orm_organization_team_repository_1.MikroOrmOrganizationTeamRepository])
], RequestApprovalService);
//# sourceMappingURL=request-approval.service.js.map
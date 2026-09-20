"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const time_off_request_entity_1 = require("./time-off-request.entity");
const request_approval_entity_1 = require("../request-approval/request-approval.entity");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const utils_2 = require("../core/utils");
const database_helper_1 = require("./../database/database.helper");
const type_orm_request_approval_repository_1 = require("../request-approval/repository/type-orm-request-approval.repository");
const mikro_orm_time_off_request_repository_1 = require("./repository/mikro-orm-time-off-request.repository");
const type_orm_time_off_request_repository_1 = require("./repository/type-orm-time-off-request.repository");
let TimeOffRequestService = class TimeOffRequestService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimeOffRequestRepository, mikroOrmTimeOffRequestRepository, typeOrmRequestApprovalRepository) {
        super(typeOrmTimeOffRequestRepository, mikroOrmTimeOffRequestRepository);
        this.typeOrmTimeOffRequestRepository = typeOrmTimeOffRequestRepository;
        this.mikroOrmTimeOffRequestRepository = mikroOrmTimeOffRequestRepository;
        this.typeOrmRequestApprovalRepository = typeOrmRequestApprovalRepository;
    }
    /**
     * Creates a new time off request and its associated approval record.
     *
     * @param entity - The input data for creating a time off request.
     * @returns A promise that resolves to the saved TimeOffRequest.
     * @throws {BadRequestException} If any error occurs during the creation process.
     */
    async create(entity) {
        const request = new time_off_request_entity_1.TimeOffRequest();
        Object.assign(request, entity);
        // Retrieve tenantId from RequestContext or options.
        const tenantId = context_1.RequestContext.currentTenantId() ?? entity.tenantId;
        // Save the time off request first.
        const timeOffRequest = await this.save(request);
        // Prepare the request approval record using the new request's id.
        const requestApproval = new request_approval_entity_1.RequestApproval();
        requestApproval.requestId = timeOffRequest.id;
        requestApproval.requestType = contracts_1.ApprovalPolicyTypesStringEnum.TIME_OFF;
        requestApproval.status = timeOffRequest.status
            ? contracts_1.StatusTypesMapRequestApprovalEnum[timeOffRequest.status]
            : contracts_1.RequestApprovalStatusTypesEnum.REQUESTED;
        requestApproval.name = 'Request time off';
        requestApproval.min_count = 1;
        requestApproval.organizationId = timeOffRequest.organizationId;
        requestApproval.tenantId = tenantId;
        // Save the request approval record. Using Promise.all here allows you to
        // concurrently run other independent asynchronous operations if needed.
        await this.typeOrmRequestApprovalRepository.save(requestApproval);
        return timeOffRequest;
    }
    async getAllTimeOffRequests(relations, findInput) {
        try {
            const { organizationId, employeeId, startDate, endDate } = findInput;
            const tenantId = context_1.RequestContext.currentTenantId();
            const start = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
            const end = moment(endDate).format('YYYY-MM-DD hh:mm:ss');
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const where = {
                        tenantId,
                        organizationId,
                        start: { $gte: start, $lte: end }
                    };
                    if (employeeId) {
                        where.employees = { id: employeeId };
                    }
                    const items = await this.mikroOrmRepository.find(where, {
                        populate: ['employees', 'policy', 'employees.user']
                    });
                    return { items: items.map((e) => this.serialize(e)), total: items.length };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder('timeoff');
                    query
                        .leftJoinAndSelect(`${query.alias}.employees`, `employees`)
                        .leftJoinAndSelect(`${query.alias}.policy`, `policy`)
                        .leftJoinAndSelect(`employees.user`, `user`);
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    }));
                    if (employeeId) {
                        const employeeIds = [employeeId];
                        query.innerJoin(`${query.alias}.employees`, 'employee', 'employee.id IN (:...employeeIds)', {
                            employeeIds
                        });
                    }
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."start" BETWEEN :begin AND :end`), {
                        begin: start,
                        end: end
                    });
                    const items = await query.getMany();
                    return { items, total: items.length };
                }
            }
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async updateTimeOffByAdmin(id, timeOffRequest) {
        try {
            // Verify the record belongs to the current tenant before updating, and make the verified id
            // the one that is saved: the body is not DTO-validated, so a body id spread after the path id
            // used to re-point the save (TypeORM save() with an existing PK is an UPDATE of that row).
            //
            // `findOneByIdString` THROWS NotFoundException when nothing matches the tenant-scoped
            // conditions, so this call is the check — an id belonging to another tenant, or to no row
            // at all, never reaches `save()` (where it would INSERT under the caller's tenant).
            await this.findOneByIdString(id);
            return await this.save({
                ...timeOffRequest,
                id
            });
        }
        catch (error) {
            // Preserve intentional HTTP exceptions (the 404 above, and the ForbiddenException that
            // `save()` raises for a cross-tenant row) instead of flattening them to 400.
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(error);
        }
    }
    async updateStatusTimeOffByAdmin(id, status) {
        try {
            // Use tenant-scoped lookup instead of direct repository access
            const timeOffRequest = await this.findOneByIdString(id);
            if (timeOffRequest.status === contracts_1.StatusTypesEnum.REQUESTED) {
                timeOffRequest.status = status;
            }
            else {
                throw new common_1.ConflictException('Request time off is Conflict');
            }
            return await this.save(timeOffRequest);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    /**
     * Time Off Request override pagination method
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const tenantId = context_1.RequestContext.currentTenantId();
                    const where = { tenantId };
                    if ((0, utils_1.isNotEmpty)(options?.where)) {
                        const { organizationId, employeeIds, isHoliday, includeArchived, status, startDate, endDate } = options.where;
                        if ((0, utils_1.isNotEmpty)(organizationId))
                            where.organizationId = organizationId;
                        if ((0, utils_1.isNotEmpty)(employeeIds))
                            where.employees = { id: { $in: employeeIds } };
                        if ((0, utils_1.isNotEmpty)(status))
                            where.status = status;
                        if ((0, utils_1.isNotEmpty)(isHoliday) && (0, utils_1.isNotEmpty)(Boolean(JSON.parse(isHoliday))))
                            where.isHoliday = false;
                        if ((0, utils_1.isNotEmpty)(includeArchived))
                            where.isArchived = Boolean(JSON.parse(includeArchived));
                        let sd = moment().startOf('month').utc().format('YYYY-MM-DD HH:mm:ss');
                        let ed = moment().endOf('month').utc().format('YYYY-MM-DD HH:mm:ss');
                        if ((0, utils_1.isNotEmpty)(startDate) && (0, utils_1.isNotEmpty)(endDate)) {
                            sd = moment.utc(startDate).format('YYYY-MM-DD HH:mm:ss');
                            ed = moment.utc(endDate).format('YYYY-MM-DD HH:mm:ss');
                        }
                        where.$or = [{ start: { $gte: sd, $lte: ed } }, { end: { $gte: sd, $lte: ed } }];
                        // Text search filters matching TypeORM branch
                        if ((0, utils_1.isNotEmpty)(where.user) && (0, utils_1.isNotEmpty)(where.user.name)) {
                            const keywords = where.user.name.split(' ');
                            const userFilters = [];
                            keywords.forEach((keyword) => {
                                userFilters.push({ employees: { user: { firstName: { $ilike: `%${keyword}%` } } } });
                                userFilters.push({ employees: { user: { lastName: { $ilike: `%${keyword}%` } } } });
                            });
                            if (where.$or) {
                                where.$and = [{ $or: where.$or }, { $or: userFilters }];
                                delete where.$or;
                            }
                            else {
                                where.$or = userFilters;
                            }
                        }
                        if ((0, utils_1.isNotEmpty)(where.description)) {
                            where.description = { $ilike: `%${where.description}%` };
                        }
                        if ((0, utils_1.isNotEmpty)(where.policy) && (0, utils_1.isNotEmpty)(where.policy.name)) {
                            where.policy = { name: { $ilike: `%${where.policy.name}%` } };
                        }
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(where, {
                        populate: (options.relations || []),
                        limit: options.take ? options.take : 10,
                        offset: options.skip ? (options.take || 10) * (options.skip - 1) : 0
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Set query options
                    if ((0, utils_1.isNotEmpty)(options)) {
                        query.setFindOptions({
                            skip: options.skip ? options.take * (options.skip - 1) : 0,
                            take: options.take ? options.take : 10,
                            ...(options.relations ? { relations: (0, utils_2.parseFindOptionsRelations)(options.relations) } : {})
                        });
                    }
                    /**
                     * The `join` find-option was removed in TypeORM v1 (passing it throws, which surfaced as a
                     * blanket 400 for every paginated request). Declare the aliases the raw predicates below
                     * rely on explicitly instead.
                     */
                    query.leftJoin(`${query.alias}.policy`, 'policy');
                    query.leftJoin(`${query.alias}.employees`, 'employees');
                    query.leftJoin('employees.user', 'user');
                    query.where((qb) => {
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), {
                                tenantId: context_1.RequestContext.currentTenantId()
                            });
                            if ((0, utils_1.isNotEmpty)(options.where)) {
                                const { where } = options;
                                if ((0, utils_1.isNotEmpty)(where.organizationId)) {
                                    const { organizationId } = where;
                                    web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), {
                                        organizationId
                                    });
                                }
                            }
                        }));
                        if ((0, utils_1.isNotEmpty)(options.where)) {
                            const { where } = options;
                            if ((0, utils_1.isNotEmpty)(where.employeeIds)) {
                                const { employeeIds } = where;
                                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employees"."id" IN (:...employeeIds)`), {
                                    employeeIds
                                });
                            }
                            /**
                             * Filter by dates or current month
                             */
                            let startDate = moment().startOf('month').utc().format('YYYY-MM-DD HH:mm:ss');
                            let endDate = moment().endOf('month').utc().format('YYYY-MM-DD HH:mm:ss');
                            if ((0, utils_1.isNotEmpty)(where.startDate) && (0, utils_1.isNotEmpty)(where.endDate)) {
                                startDate = moment.utc(where.startDate).format('YYYY-MM-DD HH:mm:ss');
                                endDate = moment.utc(where.endDate).format('YYYY-MM-DD HH:mm:ss');
                            }
                            qb.andWhere(new typeorm_1.Brackets((web) => {
                                web.where([
                                    {
                                        start: (0, typeorm_1.Between)(startDate, endDate)
                                    },
                                    {
                                        end: (0, typeorm_1.Between)(startDate, endDate)
                                    }
                                ]);
                            }));
                            if ((0, utils_1.isNotEmpty)(where.isHoliday) && (0, utils_1.isNotEmpty)(Boolean(JSON.parse(where.isHoliday)))) {
                                qb.andWhere({ isHoliday: false });
                            }
                            if ((0, utils_1.isNotEmpty)(where.includeArchived)) {
                                qb.andWhere({
                                    isArchived: Boolean(JSON.parse(where.includeArchived))
                                });
                            }
                            if ((0, utils_1.isNotEmpty)(where.status)) {
                                qb.andWhere({
                                    status: where.status
                                });
                            }
                            qb.andWhere(new typeorm_1.Brackets((web) => {
                                if ((0, utils_1.isNotEmpty)(where.user) && (0, utils_1.isNotEmpty)(where.user.name)) {
                                    const keywords = where.user.name.split(' ');
                                    keywords.forEach((keyword, index) => {
                                        web.orWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("user"."firstName") like LOWER(:keyword_${index})`), {
                                            [`keyword_${index}`]: `%${keyword}%`
                                        });
                                        web.orWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("user"."lastName") like LOWER(:${index}_keyword)`), {
                                            [`${index}_keyword`]: `%${keyword}%`
                                        });
                                    });
                                }
                            }));
                            qb.andWhere(new typeorm_1.Brackets((web) => {
                                if ((0, utils_1.isNotEmpty)(where.description)) {
                                    const { description } = where;
                                    web.andWhere({
                                        description: (0, typeorm_1.Like)(`%${description}%`)
                                    });
                                }
                                if ((0, utils_1.isNotEmpty)(where.policy) && (0, utils_1.isNotEmpty)(where.policy.name)) {
                                    web.andWhere({
                                        policy: {
                                            name: (0, typeorm_1.Like)(`%${where.policy.name}%`)
                                        }
                                    });
                                    web.andWhere((0, database_helper_1.prepareSQLQuery)(`LOWER("policy"."name") like LOWER(:name)`), {
                                        name: `%${where.policy.name}%`
                                    });
                                }
                            }));
                        }
                    });
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.TimeOffRequestService = TimeOffRequestService;
exports.TimeOffRequestService = TimeOffRequestService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_off_request_repository_1.TypeOrmTimeOffRequestRepository,
        mikro_orm_time_off_request_repository_1.MikroOrmTimeOffRequestRepository,
        type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository])
], TimeOffRequestService);
//# sourceMappingURL=time-off-request.service.js.map
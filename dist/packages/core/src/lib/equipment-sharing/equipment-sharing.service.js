"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const database_helper_1 = require("./../database/database.helper");
const context_1 = require("../core/context");
const crud_1 = require("./../core/crud");
const utils_2 = require("../core/utils");
const type_orm_equipment_sharing_repository_1 = require("./repository/type-orm-equipment-sharing.repository");
const mikro_orm_equipment_sharing_repository_1 = require("./repository/mikro-orm-equipment-sharing.repository");
const type_orm_request_approval_repository_1 = require("./../request-approval/repository/type-orm-request-approval.repository");
const reference_scope_helper_1 = require("./reference-scope.helper");
let EquipmentSharingService = class EquipmentSharingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEquipmentSharingRepository, mikroOrmEquipmentSharingRepository, typeOrmRequestApprovalRepository, configService) {
        super(typeOrmEquipmentSharingRepository, mikroOrmEquipmentSharingRepository);
        this.typeOrmRequestApprovalRepository = typeOrmRequestApprovalRepository;
        this.configService = configService;
    }
    /**
     * Refuses a referenced Equipment / EquipmentSharingPolicy that is not in the caller's scope.
     *
     * The update path is a delete-then-recreate that spreads the request body, so a body-supplied
     * `equipmentId` or `equipmentSharingPolicyId` is persisted as-is. Pinning the row's own
     * organization does not help: nothing validated what it POINTS AT, so an update could re-attach a
     * sharing to another organization's equipment. The foreign key only proves the row exists.
     *
     * Both targets extend TenantOrganizationBaseEntity, so both are scopeable.
     *
     * @param input - The update/create payload.
     * @param scope - The tenant/organization the record belongs to.
     * @throws ForbiddenException when a referenced row is outside the scope.
     */
    async assertReferencesAreInScope(input, scope) {
        await (0, reference_scope_helper_1.assertReferencesAreInScope)([
            ['equipment', input?.equipmentId],
            ['equipment_sharing_policy', input?.equipmentSharingPolicyId]
        ], scope, (table, where) => this.typeOrmRepository.manager.findOne(table, { where: where }));
    }
    /**
     * Retrieves equipment sharing records associated with a specific organization.
     *
     * @param organizationId - The unique identifier of the organization.
     * @returns A promise that resolves to an array of equipment sharing records.
     */
    async findEquipmentSharingsByOrganizationId(organizationId) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const tenantId = context_1.RequestContext.currentTenantId();
                const [items, total] = await this.mikroOrmRepository.findAndCount({ tenantId, organizationId }, {
                    populate: ['employees', 'teams', 'equipment', 'equipmentSharingPolicy']
                });
                return { items: items.map((e) => this.serialize(e)), total };
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder('equipment_sharing');
                query
                    .leftJoinAndSelect(`${query.alias}.employees`, 'employees')
                    .leftJoinAndSelect(`${query.alias}.teams`, 'teams')
                    .innerJoinAndSelect(`${query.alias}.equipment`, 'equipment')
                    .leftJoinAndSelect(`${query.alias}.equipmentSharingPolicy`, 'equipmentSharingPolicy');
                switch (this.configService.dbConnectionOptions.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        query.leftJoinAndSelect('request_approval', 'requestApproval', '"equipment_sharing"."id" = "requestApproval"."requestId"');
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                    case config_1.DatabaseTypeEnum.mysql:
                        query.leftJoinAndSelect('request_approval', 'requestApproval', 'uuid(equipment_sharing.id) = uuid(requestApproval.requestId)');
                        break;
                    default:
                        throw new Error(`Cannot create query to find equipment sharings by organizationId due to unsupported database type: ${this.configService.dbConnectionOptions.type}`);
                }
                const [items, total] = await query
                    .leftJoinAndSelect('requestApproval.approvalPolicy', 'approvalPolicy')
                    .where(new typeorm_1.Brackets((qb) => {
                    const tenantId = context_1.RequestContext.currentTenantId();
                    qb.andWhere(`"${query.alias}"."tenantId" = :tenantId`, { tenantId });
                    qb.andWhere(`"${query.alias}"."organizationId" = :organizationId`, { organizationId });
                }))
                    .getManyAndCount();
                return { items, total };
            }
        }
    }
    /**
     * Retrieves equipment sharing records associated with a specific employee.
     *
     * @param id - The unique identifier of the employee.
     * @returns A promise that resolves to a pagination object containing an array of equipment sharing records and the total count.
     * @throws BadRequestException if an error occurs during the database query.
     */
    async findEquipmentSharingsByEmployeeId(id) {
        try {
            return await this.findAll({
                where: {
                    createdByUserId: id
                },
                relations: {
                    employees: true,
                    teams: true,
                    equipment: true
                }
            });
        }
        catch (error) {
            console.error('Error finding equipment sharings by employee ID:', error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Retrieves all equipment sharing records with pagination.
     *
     * This function uses `findAndCount` to fetch all equipment sharing records along with the total
     * count. It loads related entities (`equipment`, `employees`, and `teams`) and returns an object
     * containing both the items and the total count.
     *
     * @returns A promise that resolves to an object with `items` (the equipment sharing records)
     *          and `total` (the total number of records).
     */
    async findAllEquipmentSharings() {
        return await this.findAll({
            relations: {
                employees: true,
                teams: true,
                equipment: true
            }
        });
    }
    /**
     * Creates a new EquipmentSharing record.
     *
     * @param equipmentSharing - The EquipmentSharing entity to be created.
     * @returns The saved EquipmentSharing entity.
     */
    async createEquipmentSharing(entity) {
        try {
            // Save the equipment sharing record using tenant-aware save
            const equipmentSharing = await this.save(entity);
            return equipmentSharing;
        }
        catch (error) {
            console.error('Error creating equipment sharing:', error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Updates an equipment sharing record by deleting the existing record and saving the updated input.
     *
     * @param id - The unique identifier for the equipment sharing record to update.
     * @param input - The new equipment sharing data.
     * @returns A promise that resolves to the updated EquipmentSharing record.
     */
    async update(id, input) {
        try {
            // Use parent's tenant-scoped delete instead of direct repository access
            await super.delete(id);
            // Save the new equipment sharing data with tenant scoping, under the SAME id: the body is not
            // guaranteed to carry one, and a delete-then-insert without it replaced the record with a stub
            // (approve/refuse goes through here).
            const equipmentSharing = await this.save({ ...input, id });
            // Return the newly saved record
            return equipmentSharing;
        }
        catch (err) {
            // If an error occurs, throw a BadRequestException with the error details
            throw new common_1.BadRequestException(err);
        }
    }
    /**
     * Deletes an equipment sharing record and its associated request approval.
     *
     * This function concurrently deletes the equipment sharing record from the primary repository
     * and the corresponding request approval record from the request approval repository.
     *
     * @param id - The unique identifier for the equipment sharing record to be deleted.
     * @returns A promise that resolves to the result of the equipment sharing deletion operation.
     */
    async delete(id) {
        try {
            // The equipment-sharing delete is tenant-scoped (parent); the approval-row delete runs on a RAW
            // repository, so it must be tenant-scoped explicitly and only run once the sharing row was
            // really ours — otherwise a foreign UUID deleted another tenant's request_approval row.
            const tenantId = context_1.RequestContext.currentTenantId();
            const equipmentSharing = await super.delete(id);
            // Fail CLOSED without a tenant: `...(tenantId ? { tenantId } : {})` would leave
            // `{ requestId: id }` alone on a RAW repository, deleting any tenant's approval row that
            // happens to carry this UUID. With no tenant to scope by, the approval row is left for a
            // context that can prove ownership rather than deleted blind.
            if (equipmentSharing?.affected && tenantId) {
                await this.typeOrmRequestApprovalRepository.delete({ requestId: id, tenantId });
            }
            // Return the result from the equipment sharing deletion.
            return equipmentSharing;
        }
        catch (error) {
            // If an error occurs during deletion, throw a BadRequestException with error details.
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Updates the status of an Equipment Sharing record by an admin.
     *
     * This function retrieves an Equipment Sharing record using its ID. If the record is found,
     * it updates the status property to the provided value and saves the updated record.
     * If the record is not found, it throws a NotFoundException.
     *
     * @param id - The unique identifier of the Equipment Sharing record.
     * @param status - The new status value to set for the Equipment Sharing record.
     * @returns A promise that resolves to the updated EquipmentSharing record.
     * @throws NotFoundException if no Equipment Sharing record is found with the provided ID.
     * @throws BadRequestException if an error occurs during the update process.
     */
    async updateStatusEquipmentSharingByAdmin(id, status) {
        try {
            // Use tenant-scoped lookup instead of direct repository access
            const equipmentSharing = await this.findOneByIdString(id);
            equipmentSharing.status = status;
            return await this.save(equipmentSharing);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    /**
     * Paginates equipment sharing records based on the provided filter.
     *
     * @param filter - An object containing pagination and filtering options.
     * @returns A promise that resolves to an IPagination object containing equipment sharing records and total count.
     */
    async pagination(filter) {
        try {
            // Retrieve the current user and tenant ID from the request context
            const user = context_1.RequestContext.currentUser();
            const tenantId = context_1.RequestContext.currentTenantId();
            // Retrieve the organization ID from the filter or fallback to the current request context.
            let { employeeIds = [], organizationId } = filter?.where || {};
            // Set employeeIds based on user conditions and permissions
            if (user.employeeId && !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                employeeIds = [user.employeeId];
            }
            const take = filter?.take ?? 10; // Default pagination limit is 10
            const skip = filter?.skip ? take * (filter.skip - 1) : 0; // Calculate the offset based on the skip value
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const where = {
                        tenantId,
                        organizationId,
                        equipment: { tenantId, organizationId }
                    };
                    if ((0, utils_1.isNotEmpty)(employeeIds)) {
                        where.employees = { id: { $in: employeeIds }, tenantId, organizationId };
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(where, {
                        populate: [
                            'equipment',
                            'createdByUser',
                            'equipmentSharingPolicy',
                            'employees',
                            'teams'
                        ],
                        limit: take,
                        offset: skip
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create a query builder for the EquipmentSharing entity
                    const query = this.typeOrmRepository.createQueryBuilder('equipment_sharing');
                    query.innerJoinAndSelect(`${query.alias}.equipment`, 'equipment');
                    query.innerJoinAndSelect(`${query.alias}.createdByUser`, 'createdByUser');
                    query.leftJoinAndSelect(`${query.alias}.equipmentSharingPolicy`, 'equipmentSharingPolicy');
                    query.leftJoinAndSelect(`${query.alias}.employees`, 'employees');
                    query.leftJoinAndSelect(`${query.alias}.teams`, 'teams');
                    switch (this.configService.dbConnectionOptions.type) {
                        case config_1.DatabaseTypeEnum.sqlite:
                        case config_1.DatabaseTypeEnum.betterSqlite3:
                            query.leftJoinAndSelect('request_approval', 'requestApproval', '"equipment_sharing"."id" = "requestApproval"."requestId"');
                            break;
                        case config_1.DatabaseTypeEnum.postgres:
                            query.leftJoinAndSelect('request_approval', 'requestApproval', 'uuid(equipment_sharing.id) = uuid(requestApproval.requestId)');
                            break;
                        case config_1.DatabaseTypeEnum.mysql:
                            query.leftJoinAndSelect('request_approval', 'requestApproval', (0, database_helper_1.prepareSQLQuery)(`"equipment_sharing"."id" = "requestApproval"."requestId"`));
                            break;
                        default:
                    }
                    query.leftJoinAndSelect('requestApproval.approvalPolicy', 'approvalPolicy');
                    // Add new AND WHERE condition in the query builder.
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        if (filter.where) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), {
                                organizationId
                            });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"equipment"."tenantId" = :tenantId`), { tenantId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"equipment"."organizationId" = :organizationId`), { organizationId });
                        }
                    }));
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        if ((0, utils_1.isNotEmpty)(filter.where) && (0, utils_1.isNotEmpty)(employeeIds)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employees"."id" IN (:...employeeIds)`), { employeeIds });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employees"."tenantId" = :tenantId`), { tenantId });
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"employees"."organizationId" = :organizationId`), { organizationId });
                        }
                    }));
                    const [items, total] = await query.skip(skip).take(take).getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            console.error('Error finding equipment sharings by organization ID:', error);
            throw new common_1.HttpException(`Error while finding equipment sharings by pagination: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.EquipmentSharingService = EquipmentSharingService;
exports.EquipmentSharingService = EquipmentSharingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_equipment_sharing_repository_1.TypeOrmEquipmentSharingRepository,
        mikro_orm_equipment_sharing_repository_1.MikroOrmEquipmentSharingRepository,
        type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository,
        config_1.ConfigService])
], EquipmentSharingService);
//# sourceMappingURL=equipment-sharing.service.js.map
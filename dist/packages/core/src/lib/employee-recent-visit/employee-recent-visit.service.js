"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecentVisitService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const employee_recent_visit_event_1 = require("./events/employee-recent-visit.event");
const mikro_orm_employee_recent_visit_repository_1 = require("./repository/mikro-orm-employee-recent-visit.repository");
const type_orm_employee_recent_visit_repository_1 = require("./repository/type-orm-employee-recent-visit.repository");
let EmployeeRecentVisitService = class EmployeeRecentVisitService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeRecentVisitRepository, mikroOrmEmployeeRecentVisitRepository, _eventBus) {
        super(typeOrmEmployeeRecentVisitRepository, mikroOrmEmployeeRecentVisitRepository);
        this.typeOrmEmployeeRecentVisitRepository = typeOrmEmployeeRecentVisitRepository;
        this.mikroOrmEmployeeRecentVisitRepository = mikroOrmEmployeeRecentVisitRepository;
        this._eventBus = _eventBus;
    }
    /**
     * Creates a new employee recent visit entry with the provided input, while associating it with the current employee and tenant.
     *
     * @param input - The data required to create an employee recent visit entry.
     * @returns The created employee recent visit entry.
     * @throws BadRequestException when the visit creation fails.
     */
    async create(input) {
        try {
            const { entity, entityId, organizationId } = input;
            // Retrieve the current tenant ID from the request context or use the provided tenantId
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Retrieve the current employee's ID from the request context
            const employeeId = context_1.RequestContext.currentEmployeeId() ?? context_1.RequestContext.currentUser()?.employeeId ?? input.employeeId;
            if (!employeeId) {
                throw new common_1.BadRequestException('Employee not found');
            }
            // Get the current date and time
            const now = new Date();
            // 1. Check if the current entityType and entityId pair already exists for the current employee
            const existingEntry = await this.typeOrmEmployeeRecentVisitRepository.findOne({
                where: { entity, entityId, employeeId, organizationId, tenantId }
            });
            if (existingEntry) {
                // Update the visitedAt date and return the existing entry
                existingEntry.visitedAt = now;
                return await this.save(existingEntry);
            }
            // 2. Create the employee recent visit entry using the provided input along with the employeeId and tenantId
            return await super.create({ ...input, employeeId, tenantId });
        }
        catch (error) {
            console.log('Error while creating employee recent visit:', error);
            throw new common_1.BadRequestException('Error while creating employee recent visit', error);
        }
    }
    /**
     * Finds employee recent visits based on the provided filters.
     *
     * @param filters - The filters for finding employee recent visits.
     * @returns A promise that resolves with the employee recent visits.
     * @throws BadRequestException when the finding employee recent visits fails.
     */
    async findEmployeeRecentVisits(filters) {
        try {
            // Destructure the options
            const { organizationId, entity, entityId, relations = [] } = filters;
            // Retrieve the current tenant ID from the request context
            const tenantId = context_1.RequestContext.currentTenantId();
            // Retrieve the current employee ID from the request context
            const employeeId = context_1.RequestContext.currentEmployeeId() ?? filters.employeeId;
            // Build the where clause
            const where = {
                ...(organizationId && { organizationId }),
                ...(entity && { entity }),
                ...(entityId && { entityId }),
                tenantId,
                employeeId
            };
            const take = filters.take ? filters.take : 100; // Default take value if not provided
            // Pagination: ensure `filters.skip` is a positive integer starting from 1
            const skip = filters.skip && Number.isInteger(filters.skip) && filters.skip > 0 ? filters.skip : 1;
            // Retrieve the employee recent visits
            return await this.findAll({
                where,
                ...(relations && { relations }),
                order: { visitedAt: 'DESC' },
                take,
                skip: take * (skip - 1) // Calculate offset (skip) based on validated skip value
            });
        }
        catch (error) {
            console.log('Error while finding employee recent visits:', error);
            throw new common_1.BadRequestException('Error while finding employee recent visits', error);
        }
    }
    /**
     * Emits an event to create a new employee recent visit entry with the provided input.
     *
     * @param input - The data required to create an employee recent visit entry.
     * @returns A promise that resolves with the created employee recent visit entry.
     * @throws BadRequestException when the event emission fails.
     */
    emitSaveEmployeeRecentVisitEvent(entity, entityId, data, organizationId, tenantId) {
        return this._eventBus.publish(new employee_recent_visit_event_1.EmployeeRecentVisitEvent({
            entity,
            entityId,
            data,
            organizationId,
            tenantId
        }));
    }
};
exports.EmployeeRecentVisitService = EmployeeRecentVisitService;
exports.EmployeeRecentVisitService = EmployeeRecentVisitService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_recent_visit_repository_1.TypeOrmEmployeeRecentVisitRepository,
        mikro_orm_employee_recent_visit_repository_1.MikroOrmEmployeeRecentVisitRepository,
        cqrs_1.EventBus])
], EmployeeRecentVisitService);
//# sourceMappingURL=employee-recent-visit.service.js.map
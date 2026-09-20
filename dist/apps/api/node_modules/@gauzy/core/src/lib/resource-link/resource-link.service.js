"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLinkService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const tenant_aware_crud_service_1 = require("./../core/crud/tenant-aware-crud.service");
const request_context_1 = require("../core/context/request-context");
const employee_service_1 = require("../employee/employee.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const type_orm_resource_link_repository_1 = require("./repository/type-orm-resource-link.repository");
const mikro_orm_resource_link_repository_1 = require("./repository/mikro-orm-resource-link.repository");
let ResourceLinkService = class ResourceLinkService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmResourceLinkRepository, mikroOrmResourceLinkRepository, _employeeService, _activityLogService) {
        super(typeOrmResourceLinkRepository, mikroOrmResourceLinkRepository);
        this.typeOrmResourceLinkRepository = typeOrmResourceLinkRepository;
        this.mikroOrmResourceLinkRepository = mikroOrmResourceLinkRepository;
        this._employeeService = _employeeService;
        this._activityLogService = _activityLogService;
    }
    /**
     * @description Create a new Resource Link
     * @param {IResourceLinkCreateInput} input - The data required to create a resource link.
     * @returns A promise that resolves to the created resource link entity.
     * @memberof ResourceLinkService
     */
    async create(input) {
        try {
            // Retrieve the tenantId from the request context or fall back to input value
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Retrieve the employeeId from the request context (the caller's own employee — also for
            // CHANGE_SELECTED_EMPLOYEE holders, for whom currentEmployeeId() is null) or fall back to input value
            const employeeId = request_context_1.RequestContext.currentEmployeeId() ?? request_context_1.RequestContext.currentUser()?.employeeId ?? input.employeeId;
            // Destructure the input data to use in entity creation
            const { ...entity } = input;
            // Validate that the employee exists — only a real id can be looked up (an empty one used to
            // match an arbitrary employee and pass vacuously); a caller with no employee identity keeps
            // creating an employee-less link, as before.
            if (employeeId) {
                const employee = await this._employeeService.findOneByIdString(employeeId);
                if (!employee) {
                    throw new common_1.NotFoundException(`Employee with id ${employeeId} not found`);
                }
            }
            // Create and return the resource link, passing the necessary entity data
            const resourceLink = await super.create({
                ...entity,
                employeeId,
                tenantId // Ensure tenantId is included in the entity
            });
            // Generate the activity log
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.ResourceLink, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, resourceLink.id, resourceLink.title, resourceLink, resourceLink.organizationId, tenantId);
            return resourceLink;
        }
        catch (error) {
            console.log(`Error creating resource link: ${error.message}`, error);
            throw new common_1.BadRequestException('Error creating resource link', error);
        }
    }
    /**
     * @description Update an existing Resource Link
     * @param {ID} id - The ID of the resource link to update.
     * @param {IResourceLinkUpdateInput} input - The data to update the resource link.
     * @returns A promise that resolves to the updated resource link entity, or an update result.
     * @memberof ResourceLinkService
     */
    async update(id, input) {
        try {
            // Retrieve the existing resource link by ID
            const resourceLink = await this.findOneByIdString(id);
            if (!resourceLink) {
                // If the resource link is not found, throw an exception
                throw new common_1.BadRequestException('Resource Link not found');
            }
            // Perform the update by creating a new resource link with the updated data
            const updatedResourceLink = await super.create({
                ...input,
                id // Ensure the ID is passed along with the updated data
            });
            // Generate the activity log for the update action
            const { organizationId, tenantId } = updatedResourceLink;
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.ResourceLink, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, resourceLink.id, `${resourceLink.title} for ${resourceLink.entity}`, updatedResourceLink, organizationId, tenantId, resourceLink, input);
            // Return the updated resource link entity or update result
            return updatedResourceLink;
        }
        catch (error) {
            // Handle any errors appropriately
            console.log(`An error occurred while updating the resource link: ${error.message}`, error);
            throw new common_1.BadRequestException('An error occurred while updating the resource link', error);
        }
    }
};
exports.ResourceLinkService = ResourceLinkService;
exports.ResourceLinkService = ResourceLinkService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_resource_link_repository_1.TypeOrmResourceLinkRepository,
        mikro_orm_resource_link_repository_1.MikroOrmResourceLinkRepository,
        employee_service_1.EmployeeService,
        activity_log_service_1.ActivityLogService])
], ResourceLinkService);
//# sourceMappingURL=resource-link.service.js.map
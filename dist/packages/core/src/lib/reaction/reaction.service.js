"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tenant_aware_crud_service_1 = require("./../core/crud/tenant-aware-crud.service");
const request_context_1 = require("../core/context/request-context");
const employee_service_1 = require("../employee/employee.service");
const type_orm_reaction_repository_1 = require("./repository/type-orm-reaction.repository");
const mikro_orm_reaction_repository_1 = require("./repository/mikro-orm-reaction.repository");
let ReactionService = class ReactionService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmReactionRepository, mikroOrmReactionRepository, _employeeService) {
        super(typeOrmReactionRepository, mikroOrmReactionRepository);
        this.typeOrmReactionRepository = typeOrmReactionRepository;
        this.mikroOrmReactionRepository = mikroOrmReactionRepository;
        this._employeeService = _employeeService;
    }
    /**
     * Creates a reaction based on the provided input. If a reaction matching the given criteria
     * already exists, the function will delete (toggle) the reaction instead.
     *
     * @param input - The input data required to create a reaction.
     * @returns A Promise resolving to the created reaction, or void if the reaction was toggled (deleted).
     */
    async create(input) {
        try {
            // Extract the tenantId from the input data or the current request context
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // The reacting employee is the caller's OWN employee record. currentEmployeeId() is
            // deliberately null for CHANGE_SELECTED_EMPLOYEE holders, so read the identity off the JWT
            // user as well; without any employee identity there is nobody to react as (update() and
            // delete() below already enforce this). A null here used to be dropped from the toggle
            // criteria, matching — and deleting — every other employee's identical reaction.
            const employeeId = request_context_1.RequestContext.currentEmployeeId() ?? request_context_1.RequestContext.currentUser()?.employeeId;
            if (!employeeId) {
                throw new common_1.BadRequestException('Employee ID not found in context');
            }
            // Destructure additional properties from input
            const { entity, entityId, emoji, organizationId } = input;
            // Validate employee existence
            const employee = await this._employeeService.findOneByIdString(employeeId);
            if (!employee) {
                console.error(`[Reaction Create] Employee not found with ID: ${employeeId}`);
                throw new common_1.NotFoundException('Employee not found');
            }
            // Define search criteria for an existing reaction (for toggling)
            const whereOptions = {
                emoji,
                employeeId,
                entity,
                entityId,
                tenantId,
                organizationId
            };
            // Check if a matching reaction already exists (non-throwing lookup: findOneByWhereOptions
            // raises NotFound when there is none, which turned every FIRST reaction into a 400).
            const { success, record: reaction, error: lookupError } = await this.findOneOrFailByWhereOptions(whereOptions);
            if (!success && !(lookupError instanceof common_1.NotFoundException)) {
                // Anything but "no such reaction" is a real failure — do not fall through to a duplicate create.
                throw lookupError;
            }
            // If a matching reaction exists, delete (toggle off) the reaction
            if (reaction) {
                await super.delete(whereOptions);
                return;
            }
            // Otherwise, create a new reaction with the provided details and additional context info
            return await super.create({
                ...input,
                employeeId,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            console.log('[Reaction Create] Error during reaction creation process:', error);
            throw new common_1.BadRequestException('Reaction post failed', error);
        }
    }
    /**
     * Updates a reaction based on the provided id and update input.
     * It ensures that the reaction exists and belongs to the current employee.
     *
     * @param id - The unique identifier of the reaction.
     * @param input - The update data for the reaction.
     * @returns A Promise that resolves to the updated reaction or an UpdateResult.
     * @throws BadRequestException if the employee or tenant context is missing,
     *         or if the reaction is not found.
     */
    async update(id, input) {
        try {
            // Retrieve tenantId from the current context or fallback to the input tenantId.
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID is missing from the request context.');
            }
            // Retrieve the current employee ID from the request context.
            const employeeId = request_context_1.RequestContext.currentEmployeeId();
            if (!employeeId) {
                throw new common_1.BadRequestException('Employee ID not found in context');
            }
            // Find the reaction by its ID, ensuring it belongs to the current employee.
            const reaction = await this.findOneByWhereOptions({ id, employeeId });
            if (!reaction) {
                console.error(`[ReactionUpdate] Reaction not found for id: ${id} and employeeId: ${employeeId}`);
                throw new common_1.BadRequestException('Reaction not found');
            }
            // Update the reaction using the provided input along with the employee and tenant IDs.
            return await super.update(id, { ...input, employeeId, tenantId });
        }
        catch (error) {
            console.error('[ReactionUpdate] Error during reaction update process:', error);
            throw new common_1.BadRequestException('Reaction update failed', error);
        }
    }
    /**
     * Deletes a reaction by its ID, ensuring that the reaction belongs to the current employee and tenant.
     *
     * @param id - The unique identifier of the reaction to be deleted.
     * @returns A Promise that resolves to the result of the deletion operation.
     * @throws BadRequestException if the deletion fails or if the employee/tenant context is missing.
     */
    async delete(id) {
        try {
            // Retrieve tenant and employee IDs from the request context.
            const tenantId = request_context_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID is missing from the request context.');
            }
            const employeeId = request_context_1.RequestContext.currentEmployeeId();
            if (!employeeId) {
                throw new common_1.BadRequestException('Employee ID is missing from the request context.');
            }
            // Execute the deletion using the parent class method, scoped by tenant and employee.
            return await super.delete(id, { where: { employeeId, tenantId } });
        }
        catch (error) {
            console.error(`[ReactionDelete] Failed to delete reaction with id: ${id}. Error:`, error);
            throw new common_1.BadRequestException('Reaction deletion failed', error);
        }
    }
};
exports.ReactionService = ReactionService;
exports.ReactionService = ReactionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_reaction_repository_1.TypeOrmReactionRepository,
        mikro_orm_reaction_repository_1.MikroOrmReactionRepository,
        employee_service_1.EmployeeService])
], ReactionService);
//# sourceMappingURL=reaction.service.js.map
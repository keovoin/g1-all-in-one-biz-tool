"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const events_1 = require("../entity-subscription/events");
const employee_service_1 = require("../employee/employee.service");
const mention_service_1 = require("../mention/mention.service");
const type_orm_comment_repository_1 = require("./repository/type-orm-comment.repository");
const mikro_orm_comment_repository_1 = require("./repository/mikro-orm-comment.repository");
let CommentService = class CommentService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCommentRepository, mikroOrmCommentRepository, _eventBus, _employeeService, _mentionService) {
        super(typeOrmCommentRepository, mikroOrmCommentRepository);
        this.typeOrmCommentRepository = typeOrmCommentRepository;
        this.mikroOrmCommentRepository = mikroOrmCommentRepository;
        this._eventBus = _eventBus;
        this._employeeService = _employeeService;
        this._mentionService = _mentionService;
    }
    /**
     * Creates a new comment with the provided input, handling employee validation,
     * publishing mention notifications, and subscribing the comment creator to the related entity.
     *
     * This function retrieves context-specific IDs from the RequestContext (tenant, employee)
     * and falls back to the values in the input if necessary. It verifies that the employee exists,
     * creates the comment, publishes mention notifications for each mentioned employee, and
     * triggers a subscription event for the creator.
     *
     * @param {ICommentCreateInput} input - The input data required to create a comment, including text, mentions, and organization details.
     * @returns {Promise<IComment>} A promise that resolves to the newly created comment.
     * @throws {NotFoundException} If the employee associated with the comment is not found.
     * @throws {BadRequestException} If any error occurs during the creation of the comment.
     */
    async create(input) {
        try {
            // Retrieve context-specific IDs.
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // The author is the caller's own employee. RequestContext.currentEmployeeId() is deliberately
            // null for CHANGE_SELECTED_EMPLOYEE holders, so fall back to the JWT user's employee before the
            // body value; a caller with no employee identity at all posts an author-less comment (as before).
            const employeeId = context_1.RequestContext.currentEmployeeId() ?? context_1.RequestContext.currentUser()?.employeeId ?? input.employeeId;
            const { mentionEmployeeIds = [], organizationId, ...data } = input;
            // Validate that the employee exists (only a real id can be looked up — an empty one used to
            // match an arbitrary employee and pass vacuously).
            if (employeeId) {
                const employee = await this._employeeService.findOneByIdString(employeeId);
                if (!employee) {
                    throw new common_1.NotFoundException(`Employee with id ${employeeId} not found`);
                }
            }
            // Create the comment.
            const comment = await super.create({
                ...data,
                employeeId,
                tenantId,
                organizationId
            });
            // Publish mentions for each mentioned employee, if any.
            await Promise.all(mentionEmployeeIds.map((mentionedEmployeeId) => this._mentionService.publishMention({
                entity: contracts_1.BaseEntityEnum.Comment,
                entityId: comment.id,
                entityName: input.entityName,
                parentEntityId: comment.entityId,
                parentEntityType: comment.entity,
                mentionedEmployeeId,
                organizationId: comment.organizationId,
                tenantId: comment.tenantId
            })));
            // Subscribe the comment created by user to the entity.
            this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                entity: input.entity,
                entityId: input.entityId,
                employeeId,
                type: contracts_1.EntitySubscriptionTypeEnum.COMMENT,
                organizationId: comment.organizationId,
                tenantId: comment.tenantId
            }));
            // Return the newly created comment.
            return comment;
        }
        catch (error) {
            console.log(`Error while creating comment: ${error.message}`, error);
            throw new common_1.BadRequestException('Comment post failed', error);
        }
    }
    /**
     * Updates an existing comment based on the provided id and update input.
     *
     * This function first retrieves the current employee's ID from the request context,
     * then attempts to locate the comment matching the provided id and employeeId.
     * If the comment is found, it creates an updated version of the comment using the input data.
     * Additionally, it synchronizes any mention updates via the _mentionService.
     *
     * @param {ID} id - The unique identifier of the comment to update.
     * @param {ICommentUpdateInput} input - The update data for the comment, including any mention updates.
     * @returns {Promise<IComment | UpdateResult>} A promise that resolves to the updated comment or an update result.
     * @throws {BadRequestException} If the comment is not found or if the update operation fails.
     */
    async update(id, input) {
        try {
            const employeeId = context_1.RequestContext.currentEmployeeId();
            const canChangeSelectedEmployee = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
            const { mentionEmployeeIds = [] } = input;
            // Find the comment for the current employee with the given id. Callers holding
            // CHANGE_SELECTED_EMPLOYEE may edit any comment of the tenant; everyone else must be the
            // author — and therefore must have an employee identity (a null key was previously just
            // dropped from the query, which let employee-less callers edit anything).
            if (!canChangeSelectedEmployee && !employeeId) {
                throw new common_1.ForbiddenException(`You don't have permission to update this comment`);
            }
            const comment = await this.findOneByWhereOptions({
                id,
                ...(canChangeSelectedEmployee ? {} : { employeeId })
            });
            if (!comment) {
                throw new common_1.BadRequestException(`Comment with id ${id} not found`);
            }
            // Update the comment with the new input data.
            const updatedComment = await super.create({
                ...input,
                id
            });
            // Synchronize any mention updates for the comment.
            await this._mentionService.updateEntityMentions(contracts_1.BaseEntityEnum.Comment, id, mentionEmployeeIds, updatedComment.entityId, updatedComment.entity);
            return updatedComment;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.log(`Error while updating comment: ${error.message}`, error);
            throw new common_1.BadRequestException('Comment update failed', error);
        }
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_comment_repository_1.TypeOrmCommentRepository,
        mikro_orm_comment_repository_1.MikroOrmCommentRepository,
        cqrs_1.EventBus,
        employee_service_1.EmployeeService,
        mention_service_1.MentionService])
], CommentService);
//# sourceMappingURL=comment.service.js.map
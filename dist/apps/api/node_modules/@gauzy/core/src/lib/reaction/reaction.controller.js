"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("../shared/guards");
const crud_1 = require("./../core/crud");
const reaction_entity_1 = require("./reaction.entity");
const reaction_service_1 = require("./reaction.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let ReactionController = class ReactionController extends crud_1.CrudController {
    constructor(reactionService, commandBus) {
        super(reactionService);
        this.reactionService = reactionService;
        this.commandBus = commandBus;
    }
    /**
     * Retrieves a paginated list of reactions filtered by type.
     *
     * @param params - Pagination and filtering parameters for retrieving reactions.
     * @returns A Promise resolving to a paginated list of reactions.
     */
    async findAll(params) {
        return await this.reactionService.findAll(params);
    }
    /**
     * Retrieves a reaction by its unique identifier.
     *
     * @param id - The unique identifier of the reaction.
     * @param params - Optional query parameters for filtering the reaction.
     * @returns A Promise that resolves to the found Reaction.
     * @throws NotFoundException if the reaction is not found.
     */
    async findById(id, params) {
        // Retrieve the reaction using the service
        return await this.reactionService.findOneByIdString(id, params);
    }
    /**
     * Creates a new reaction.
     *
     * @param entity - The reaction data to create.
     * @returns A promise that resolves with the created reaction.
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.ReactionCreateCommand(entity));
    }
    /**
     * Updates an existing reaction.
     *
     * @param id - The unique identifier of the reaction to update.
     * @param entity - The updated reaction data.
     * @returns The updated reaction.
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ReactionUpdateCommand(id, entity));
    }
    /**
     * Deletes a reaction by its ID, ensuring that it belongs to the current employee and tenant.
     *
     * @param id - The unique identifier of the reaction to be deleted.
     * @returns A Promise that resolves with no content upon successful deletion.
     * @throws NotFoundException if the reaction is not found.
     */
    async delete(id) {
        // The reactionService.delete method should throw an exception if deletion fails.
        return await this.reactionService.delete(id);
    }
};
exports.ReactionController = ReactionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all reactions filtered by type.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found reactions',
        type: reaction_entity_1.Reaction
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ReactionController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find reaction by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record',
        type: reaction_entity_1.Reaction // Ensure that Reaction is imported and annotated properly
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ReactionController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create reaction' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong.'
    }),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateReactionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ReactionController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing reaction' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The reaction has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Reaction not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateReactionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ReactionController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a reaction by its ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The reaction has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Reaction not found.'
    }),
    (0, common_1.Delete)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ReactionController.prototype, "delete", null);
exports.ReactionController = ReactionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Reactions'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/reaction'),
    tslib_1.__metadata("design:paramtypes", [reaction_service_1.ReactionService, cqrs_1.CommandBus])
], ReactionController);
//# sourceMappingURL=reaction.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const crud_1 = require("../core/crud");
const pipes_1 = require("../shared/pipes");
const guards_1 = require("../shared/guards");
const comment_entity_1 = require("./comment.entity");
const comment_service_1 = require("./comment.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let CommentController = class CommentController extends crud_1.CrudController {
    constructor(commentService, commandBus) {
        super(commentService);
        this.commentService = commentService;
        this.commandBus = commandBus;
    }
    /**
     * Finds all comments filtered by type (or other criteria) with pagination.
     *
     * @param params - Pagination and filter parameters.
     * @returns A promise that resolves with paginated comments.
     */
    async findAll(params) {
        return await this.commentService.findAll(params);
    }
    /**
     * Finds a comment by its id.
     *
     * @param id - The id of the comment.
     * @param params - Optional parameters (e.g., relations to load).
     * @returns The found comment record.
     */
    async findById(id, params) {
        return this.commentService.findOneByIdString(id, params);
    }
    /**
     * Creates a new comment using the provided DTO.
     *
     * @param createCommentDto - Data transfer object containing comment data.
     * @returns A promise resolving to the created comment.
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.CommentCreateCommand(entity));
    }
    /**
     * Updates an existing comment identified by the provided id.
     *
     * @param id - The unique identifier of the comment.
     * @param updateCommentDto - The data transfer object containing update data.
     * @returns The updated comment.
     * @throws NotFoundException if the comment does not exist.
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.CommentUpdateCommand(id, entity));
    }
    /**
     * Deletes a comment identified by the given id.
     *
     * @param id - The unique identifier of the comment to delete.
     * @returns A promise resolving to the result of the delete operation.
     * @throws NotFoundException if the comment is not found.
     */
    async delete(id) {
        return await this.commentService.delete(id);
    }
};
exports.CommentController = CommentController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all comments filtered by type.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found comments',
        type: comment_entity_1.Comment
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
], CommentController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record'
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
], CommentController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create/Post a comment' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateCommentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CommentController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing comment' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateCommentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CommentController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete comment' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CommentController.prototype, "delete", null);
exports.CommentController = CommentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/comment'),
    tslib_1.__metadata("design:paramtypes", [comment_service_1.CommentService, cqrs_1.CommandBus])
], CommentController);
//# sourceMappingURL=comment.controller.js.map
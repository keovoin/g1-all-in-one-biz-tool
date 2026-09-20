"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const comment_service_1 = require("../../comment.service");
const comment_create_command_1 = require("../comment.create.command");
let CommentCreateHandler = class CommentCreateHandler {
    constructor(commentService) {
        this.commentService = commentService;
    }
    /**
     * Executes the CommentCreateCommand to create a new comment.
     *
     * This function extracts the input data from the provided command and invokes the comment service
     * to create a comment. If an error occurs during the process, it logs the error and throws a
     * BadRequestException.
     *
     * @param {CommentCreateCommand} command - The command containing the input data for creating the comment.
     * @returns {Promise<IComment>} A promise that resolves to the newly created comment.
     * @throws {BadRequestException} If the comment creation fails.
     */
    async execute(command) {
        try {
            const { input } = command;
            return await this.commentService.create(input);
        }
        catch (error) {
            console.log(`Error while creating comment: ${error.message}`, error);
            throw new common_1.BadRequestException('Comment post failed', error);
        }
    }
};
exports.CommentCreateHandler = CommentCreateHandler;
exports.CommentCreateHandler = CommentCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(comment_create_command_1.CommentCreateCommand),
    tslib_1.__metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentCreateHandler);
//# sourceMappingURL=comment.create.handler.js.map
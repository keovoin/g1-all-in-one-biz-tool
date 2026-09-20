"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const comment_service_1 = require("../../comment.service");
const comment_update_command_1 = require("../comment.update.command");
let CommentUpdateHandler = class CommentUpdateHandler {
    constructor(commentService) {
        this.commentService = commentService;
    }
    /**
     * Executes the CommentUpdateCommand to update an existing comment.
     *
     * This function extracts the comment ID and the update input from the command, and then invokes the
     * comment service's update method to perform the update. It returns a promise that resolves to either
     * the updated comment or an update result.
     *
     * If an error occurs during the update, the error is logged and a BadRequestException is thrown.
     *
     * @param {CommentUpdateCommand} command - The command containing the comment ID and update data.
     * @returns {Promise<IComment | UpdateResult>} A promise that resolves to the updated comment or update result.
     * @throws {BadRequestException} If the update process fails.
     */
    async execute(command) {
        try {
            const { id, input } = command;
            return await this.commentService.update(id, input);
        }
        catch (error) {
            console.log(`Error while updating comment: ${error.message}`, error);
            throw new common_1.BadRequestException('Comment update failed', error);
        }
    }
};
exports.CommentUpdateHandler = CommentUpdateHandler;
exports.CommentUpdateHandler = CommentUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(comment_update_command_1.CommentUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentUpdateHandler);
//# sourceMappingURL=comment.update.handler.js.map
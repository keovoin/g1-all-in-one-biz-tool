"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeleteHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const user_delete_command_1 = require("./../user.delete.command");
const user_service_1 = require("./../../user.service");
let UserDeleteHandler = class UserDeleteHandler {
    constructor(userService) {
        this.userService = userService;
    }
    /**
     * Executes the `UserDeleteCommand` to delete a user by ID.
     *
     * @param command - The `UserDeleteCommand` containing the ID of the user to delete.
     * @returns A promise resolving to the `DeleteResult` of the operation.
     * @throws ForbiddenException if the deletion fails.
     */
    async execute(command) {
        const { userId } = command;
        try {
            // Attempt to delete the user by ID
            return await this.userService.delete(userId);
        }
        catch (error) {
            // Handle errors and throw a ForbiddenException for unauthorized operations
            throw new common_1.ForbiddenException('You are not allowed to delete this user.');
        }
    }
};
exports.UserDeleteHandler = UserDeleteHandler;
exports.UserDeleteHandler = UserDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(user_delete_command_1.UserDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService])
], UserDeleteHandler);
//# sourceMappingURL=user.delete.handler.js.map
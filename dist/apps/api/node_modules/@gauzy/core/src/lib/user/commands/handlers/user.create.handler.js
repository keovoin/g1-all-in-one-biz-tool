"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const user_create_command_1 = require("../user.create.command");
const user_service_1 = require("../../user.service");
let UserCreateHandler = class UserCreateHandler {
    constructor(userService) {
        this.userService = userService;
    }
    /**
     * Executes the user creation command by calling the UserService to create a new user.
     *
     * @param command The UserCreateCommand containing user creation input.
     * @returns A Promise resolving to the created IUser object.
     */
    async execute(command) {
        const { input } = command;
        // Creating a SUPER_ADMIN is reserved to callers who may edit super admins — the same boundary
        // the register handler and invite creation enforce. Both the flat `roleId` and the `role`
        // relation are resolved from the database (the relation wins on persist), and an id that does
        // not belong to the caller's tenant is refused rather than ignored.
        await this.userService.assertCanAssignRoles([input?.roleId, input?.role?.id]);
        return await this.userService.create(input);
    }
};
exports.UserCreateHandler = UserCreateHandler;
exports.UserCreateHandler = UserCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(user_create_command_1.UserCreateCommand),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService])
], UserCreateHandler);
//# sourceMappingURL=user.create.handler.js.map
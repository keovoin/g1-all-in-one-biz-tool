"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const changelog_service_1 = require("../../changelog.service");
const changelog_create_command_1 = require("../changelog.create.command");
let ChangelogCreateHandler = class ChangelogCreateHandler {
    constructor(changelogService) {
        this.changelogService = changelogService;
    }
    async execute(command) {
        const { input } = command;
        if (input.hasOwnProperty('id')) {
            delete input['id'];
        }
        return this.changelogService.create(input);
    }
};
exports.ChangelogCreateHandler = ChangelogCreateHandler;
exports.ChangelogCreateHandler = ChangelogCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(changelog_create_command_1.ChangelogCreateCommand),
    tslib_1.__metadata("design:paramtypes", [changelog_service_1.ChangelogService])
], ChangelogCreateHandler);
//# sourceMappingURL=changelog.create.handler.js.map
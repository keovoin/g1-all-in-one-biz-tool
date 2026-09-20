"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const changelog_service_1 = require("../../changelog.service");
const changelog_update_command_1 = require("../changelog.update.command");
let ChangelogUpdateHandler = class ChangelogUpdateHandler {
    constructor(changelogService) {
        this.changelogService = changelogService;
    }
    async execute(command) {
        const { input } = command;
        const { id } = input;
        return this.changelogService.create({ ...input, id });
    }
};
exports.ChangelogUpdateHandler = ChangelogUpdateHandler;
exports.ChangelogUpdateHandler = ChangelogUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(changelog_update_command_1.ChangelogUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [changelog_service_1.ChangelogService])
], ChangelogUpdateHandler);
//# sourceMappingURL=changelog.update.handler.js.map
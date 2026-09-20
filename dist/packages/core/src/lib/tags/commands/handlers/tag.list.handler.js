"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagListHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const tag_service_1 = require("./../../tag.service");
const tag_list_command_1 = require("./../tag.list.command");
let TagListHandler = class TagListHandler {
    constructor(tagService) {
        this.tagService = tagService;
    }
    async execute(command) {
        const { input, relations = [] } = command;
        return await this.tagService.findTags(input, relations);
    }
};
exports.TagListHandler = TagListHandler;
exports.TagListHandler = TagListHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tag_list_command_1.TagListCommand),
    tslib_1.__metadata("design:paramtypes", [tag_service_1.TagService])
], TagListHandler);
//# sourceMappingURL=tag.list.handler.js.map
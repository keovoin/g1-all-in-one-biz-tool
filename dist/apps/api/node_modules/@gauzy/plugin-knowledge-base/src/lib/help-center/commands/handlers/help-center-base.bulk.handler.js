"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const help_center_base_bulk_command_1 = require("../help-center-base.bulk.command");
const help_center_service_1 = require("../../help-center.service");
let KnowledgeBaseBulkDeleteHandler = class KnowledgeBaseBulkDeleteHandler {
    constructor(helpCenterService) {
        this.helpCenterService = helpCenterService;
    }
    async execute(command) {
        const { id } = command;
        const categories = await this.helpCenterService.getCategoriesByBaseId(id);
        const ids = categories.map((item) => item.id);
        if ((0, utils_1.isNotEmpty)(ids)) {
            await this.helpCenterService.deleteBulkByBaseId(categories.map((item) => item.id));
        }
        return;
    }
};
exports.KnowledgeBaseBulkDeleteHandler = KnowledgeBaseBulkDeleteHandler;
exports.KnowledgeBaseBulkDeleteHandler = KnowledgeBaseBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(help_center_base_bulk_command_1.KnowledgeBaseBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [help_center_service_1.HelpCenterService])
], KnowledgeBaseBulkDeleteHandler);
//# sourceMappingURL=help-center-base.bulk.handler.js.map
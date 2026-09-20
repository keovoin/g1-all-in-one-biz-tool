"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const help_center_article_update_command_1 = require("../help-center-article.update.command");
const help_center_article_service_1 = require("./../../help-center-article.service");
let HelpCenterArticleUpdateHandler = class HelpCenterArticleUpdateHandler {
    constructor(helpCenterArticle) {
        this.helpCenterArticle = helpCenterArticle;
    }
    async execute(command) {
        const { id, input } = command;
        // Check if content fields are being updated with actual values (versioning needed)
        const isContentUpdate = input.descriptionHtml !== undefined ||
            input.descriptionJson !== undefined ||
            input.descriptionBinary !== undefined;
        if (isContentUpdate) {
            // Get current user's employee ID for version ownership
            // Use currentUser().employeeId and currentEmployeeId() 
            // because currentEmployeeId() returns null for users with CHANGE_SELECTED_EMPLOYEE permission (admins)
            const employeeId = core_1.RequestContext.currentEmployeeId() || core_1.RequestContext.currentUser()?.employeeId;
            if (employeeId) {
                // Create version snapshot before updating
                await this.helpCenterArticle.updateWithVersioning(id, input, employeeId);
            }
            else {
                // No employee context (system/admin without employee), update without versioning
                await this.helpCenterArticle.updateArticleById(id, input);
            }
        }
        else {
            // Metadata update (no versioning needed)
            await this.helpCenterArticle.updateArticleById(id, input);
        }
    }
};
exports.HelpCenterArticleUpdateHandler = HelpCenterArticleUpdateHandler;
exports.HelpCenterArticleUpdateHandler = HelpCenterArticleUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(help_center_article_update_command_1.HelpCenterUpdateArticleCommand),
    tslib_1.__metadata("design:paramtypes", [help_center_article_service_1.HelpCenterArticleService])
], HelpCenterArticleUpdateHandler);
//# sourceMappingURL=help-center-article.update.handler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitPluginForReviewCommand = void 0;
class SubmitPluginForReviewCommand {
    constructor(pluginId, reviewNotes, tenantId, organizationId, userId) {
        this.pluginId = pluginId;
        this.reviewNotes = reviewNotes;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.SubmitPluginForReviewCommand = SubmitPluginForReviewCommand;
SubmitPluginForReviewCommand.type = '[Plugin] Submit For Review';
//# sourceMappingURL=submit-plugin-for-review.command.js.map
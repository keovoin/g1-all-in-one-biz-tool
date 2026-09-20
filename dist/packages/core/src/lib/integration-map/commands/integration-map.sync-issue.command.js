"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncIssueCommand = void 0;
class IntegrationMapSyncIssueCommand {
    constructor(request, triggeredEvent = true // Enabled the "2 Way Sync Triggered Event" Synchronization
    ) {
        this.request = request;
        this.triggeredEvent = triggeredEvent;
    }
}
exports.IntegrationMapSyncIssueCommand = IntegrationMapSyncIssueCommand;
IntegrationMapSyncIssueCommand.type = '[Integration Map] Sync Issue';
//# sourceMappingURL=integration-map.sync-issue.command.js.map
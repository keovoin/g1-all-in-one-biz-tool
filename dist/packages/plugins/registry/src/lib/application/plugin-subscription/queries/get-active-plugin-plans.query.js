"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivePluginPlansQuery = void 0;
class GetActivePluginPlansQuery {
    constructor(pluginId, type, relations = []) {
        this.pluginId = pluginId;
        this.type = type;
        this.relations = relations;
    }
}
exports.GetActivePluginPlansQuery = GetActivePluginPlansQuery;
GetActivePluginPlansQuery.type = '[Plugin Subscription Plan] Get Active Plans';
//# sourceMappingURL=get-active-plugin-plans.query.js.map
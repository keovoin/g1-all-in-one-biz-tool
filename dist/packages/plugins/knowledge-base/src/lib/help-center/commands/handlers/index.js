"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const help_center_bulk_handler_1 = require("./help-center.bulk.handler");
const help_center_base_bulk_handler_1 = require("./help-center-base.bulk.handler");
exports.CommandHandlers = [
    help_center_bulk_handler_1.HelpCenterUpdateHandler,
    help_center_base_bulk_handler_1.KnowledgeBaseBulkDeleteHandler
];
//# sourceMappingURL=index.js.map
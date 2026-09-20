"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const proposal_create_handler_1 = require("./proposal-create.handler");
const proposal_update_handler_1 = require("./proposal-update.handler");
exports.CommandHandlers = [
    proposal_create_handler_1.ProposalCreateHandler,
    proposal_update_handler_1.ProposalUpdateHandler
];
//# sourceMappingURL=index.js.map
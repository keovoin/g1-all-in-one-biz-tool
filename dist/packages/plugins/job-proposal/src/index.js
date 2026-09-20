"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalCreateCommand = exports.ProposalService = exports.ProposalModule = void 0;
const tslib_1 = require("tslib");
/**
 * Public API Surface of @gauzy/plugin-job-proposal
 */
tslib_1.__exportStar(require("./lib/job-proposal.plugin"), exports);
var proposal_module_1 = require("./lib/proposal/proposal.module");
Object.defineProperty(exports, "ProposalModule", { enumerable: true, get: function () { return proposal_module_1.ProposalModule; } });
var proposal_service_1 = require("./lib/proposal/proposal.service");
Object.defineProperty(exports, "ProposalService", { enumerable: true, get: function () { return proposal_service_1.ProposalService; } });
var commands_1 = require("./lib/proposal/commands");
Object.defineProperty(exports, "ProposalCreateCommand", { enumerable: true, get: function () { return commands_1.ProposalCreateCommand; } });
//# sourceMappingURL=index.js.map
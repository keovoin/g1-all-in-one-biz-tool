"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const organization_strategic_initiative_create_handler_1 = require("./organization-strategic-initiative.create.handler");
const organization_strategic_initiative_update_handler_1 = require("./organization-strategic-initiative.update.handler");
const organization_strategic_initiative_update_signals_handler_1 = require("./organization-strategic-initiative.update-signals.handler");
exports.CommandHandlers = [
    organization_strategic_initiative_create_handler_1.OrganizationStrategicInitiativeCreateHandler,
    organization_strategic_initiative_update_handler_1.OrganizationStrategicInitiativeUpdateHandler,
    organization_strategic_initiative_update_signals_handler_1.OrganizationStrategicInitiativeUpdateSignalsHandler
];
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandlers = void 0;
const organization_strategic_initiative_find_all_handler_1 = require("./organization-strategic-initiative.find-all.handler");
const organization_strategic_initiative_find_one_handler_1 = require("./organization-strategic-initiative.find-one.handler");
const organization_strategic_initiative_find_by_project_handler_1 = require("./organization-strategic-initiative.find-by-project.handler");
exports.QueryHandlers = [
    organization_strategic_initiative_find_all_handler_1.OrganizationStrategicInitiativeFindAllHandler,
    organization_strategic_initiative_find_one_handler_1.OrganizationStrategicInitiativeFindOneHandler,
    organization_strategic_initiative_find_by_project_handler_1.OrganizationStrategicInitiativeFindByProjectHandler
];
//# sourceMappingURL=index.js.map
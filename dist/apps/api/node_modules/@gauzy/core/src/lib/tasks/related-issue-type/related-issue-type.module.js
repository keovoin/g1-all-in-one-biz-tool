"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRelatedIssueTypeModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const related_issue_type_entity_1 = require("./related-issue-type.entity");
const related_issue_type_controller_1 = require("./related-issue-type.controller");
const related_issue_type_service_1 = require("./related-issue-type.service");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
const type_orm_related_issue_type_repository_1 = require("./repository/type-orm-related-issue-type.repository");
const mikro_orm_related_issue_type_repository_1 = require("./repository/mikro-orm-related-issue-type.repository");
let TaskRelatedIssueTypeModule = class TaskRelatedIssueTypeModule {
};
exports.TaskRelatedIssueTypeModule = TaskRelatedIssueTypeModule;
exports.TaskRelatedIssueTypeModule = TaskRelatedIssueTypeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([related_issue_type_entity_1.TaskRelatedIssueType]),
            nestjs_1.MikroOrmModule.forFeature([related_issue_type_entity_1.TaskRelatedIssueType]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [related_issue_type_controller_1.TaskRelatedIssueTypeController],
        providers: [
            related_issue_type_service_1.TaskRelatedIssueTypeService,
            type_orm_related_issue_type_repository_1.TypeOrmTaskRelatedIssueTypeRepository,
            mikro_orm_related_issue_type_repository_1.MikroOrmTaskRelatedIssueTypeRepository,
            ...handlers_2.QueryHandlers,
            ...handlers_1.CommandHandlers
        ],
        exports: [related_issue_type_service_1.TaskRelatedIssueTypeService]
    })
], TaskRelatedIssueTypeModule);
//# sourceMappingURL=related-issue-type.module.js.map
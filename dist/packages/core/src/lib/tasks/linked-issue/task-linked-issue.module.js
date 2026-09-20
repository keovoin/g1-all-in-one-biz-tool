"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLinkedIssueModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const task_linked_issue_entity_1 = require("./task-linked-issue.entity");
const handlers_1 = require("./commands/handlers");
const task_linked_issue_controller_1 = require("./task-linked-issue.controller");
const task_linked_issue_service_1 = require("./task-linked-issue.service");
const type_orm_linked_issue_repository_1 = require("./repository/type-orm-linked-issue.repository");
const mikro_orm_linked_issue_repository_1 = require("./repository/mikro-orm-linked-issue.repository");
let TaskLinkedIssueModule = class TaskLinkedIssueModule {
};
exports.TaskLinkedIssueModule = TaskLinkedIssueModule;
exports.TaskLinkedIssueModule = TaskLinkedIssueModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([task_linked_issue_entity_1.TaskLinkedIssue]),
            nestjs_1.MikroOrmModule.forFeature([task_linked_issue_entity_1.TaskLinkedIssue]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [task_linked_issue_controller_1.TaskLinkedIssueController],
        providers: [task_linked_issue_service_1.TaskLinkedIssueService, type_orm_linked_issue_repository_1.TypeOrmTaskLinkedIssueRepository, mikro_orm_linked_issue_repository_1.MikroOrmTaskLinkedIssueRepository, ...handlers_1.CommandHandlers],
        exports: [task_linked_issue_service_1.TaskLinkedIssueService]
    })
], TaskLinkedIssueModule);
//# sourceMappingURL=task-linked-issue.module.js.map
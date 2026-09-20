"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataBootstrapModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const tag_module_1 = require("../../tags/tag.module");
const issue_type_module_1 = require("../issue-type/issue-type.module");
const priority_module_1 = require("../priorities/priority.module");
const related_issue_type_module_1 = require("../related-issue-type/related-issue-type.module");
const size_module_1 = require("../sizes/size.module");
const status_module_1 = require("../statuses/status.module");
const version_module_1 = require("../versions/version.module");
const task_metadata_bootstrap_controller_1 = require("./task-metadata-bootstrap.controller");
const task_metadata_bootstrap_service_1 = require("./task-metadata-bootstrap.service");
let TaskMetadataBootstrapModule = class TaskMetadataBootstrapModule {
};
exports.TaskMetadataBootstrapModule = TaskMetadataBootstrapModule;
exports.TaskMetadataBootstrapModule = TaskMetadataBootstrapModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            status_module_1.TaskStatusModule,
            priority_module_1.TaskPriorityModule,
            size_module_1.TaskSizeModule,
            tag_module_1.TagModule,
            version_module_1.TaskVersionModule,
            issue_type_module_1.IssueTypeModule,
            related_issue_type_module_1.TaskRelatedIssueTypeModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [task_metadata_bootstrap_controller_1.TaskMetadataBootstrapController],
        providers: [task_metadata_bootstrap_service_1.TaskMetadataBootstrapService]
    })
], TaskMetadataBootstrapModule);
//# sourceMappingURL=task-metadata-bootstrap.module.js.map
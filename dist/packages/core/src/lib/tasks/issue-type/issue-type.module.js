"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueTypeModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const issue_type_controller_1 = require("./issue-type.controller");
const issue_type_entity_1 = require("./issue-type.entity");
const issue_type_service_1 = require("./issue-type.service");
const handlers_1 = require("./commands/handlers");
const type_orm_issue_type_repository_1 = require("./repository/type-orm-issue-type.repository");
const mikro_orm_issue_type_repository_1 = require("./repository/mikro-orm-issue-type.repository");
let IssueTypeModule = class IssueTypeModule {
};
exports.IssueTypeModule = IssueTypeModule;
exports.IssueTypeModule = IssueTypeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([issue_type_entity_1.IssueType]),
            nestjs_1.MikroOrmModule.forFeature([issue_type_entity_1.IssueType]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [issue_type_controller_1.IssueTypeController],
        providers: [issue_type_service_1.IssueTypeService, type_orm_issue_type_repository_1.TypeOrmIssueTypeRepository, mikro_orm_issue_type_repository_1.MikroOrmIssueTypeRepository, ...handlers_1.CommandHandlers],
        exports: [issue_type_service_1.IssueTypeService]
    })
], IssueTypeModule);
//# sourceMappingURL=issue-type.module.js.map
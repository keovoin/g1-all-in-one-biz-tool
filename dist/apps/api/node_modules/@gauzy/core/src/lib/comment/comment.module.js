"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const mention_module_1 = require("../mention/mention.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const handlers_1 = require("./commands/handlers");
const comment_service_1 = require("./comment.service");
const comment_controller_1 = require("./comment.controller");
const comment_entity_1 = require("./comment.entity");
const type_orm_comment_repository_1 = require("./repository/type-orm-comment.repository");
const mikro_orm_comment_repository_1 = require("./repository/mikro-orm-comment.repository");
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment]),
            nestjs_1.MikroOrmModule.forFeature([comment_entity_1.Comment]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            mention_module_1.MentionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [comment_controller_1.CommentController],
        providers: [comment_service_1.CommentService, type_orm_comment_repository_1.TypeOrmCommentRepository, mikro_orm_comment_repository_1.MikroOrmCommentRepository, ...handlers_1.CommandHandlers]
    })
], CommentModule);
//# sourceMappingURL=comment.module.js.map
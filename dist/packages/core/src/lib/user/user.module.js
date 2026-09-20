"use strict";
// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const factory_reset_module_1 = require("./factory-reset/factory-reset.module");
const task_module_1 = require("./../tasks/task.module");
const employee_module_1 = require("./../employee/employee.module");
const password_hash_module_1 = require("../password-hash/password-hash.module");
const type_orm_user_repository_1 = require("./repository/type-orm-user.repository");
const mikro_orm_user_repository_1 = require("./repository/mikro-orm-user.repository");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            nestjs_1.MikroOrmModule.forFeature([user_entity_1.User]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => task_module_1.TaskModule),
            (0, common_1.forwardRef)(() => employee_module_1.EmployeeModule),
            password_hash_module_1.PasswordHashModule,
            factory_reset_module_1.FactoryResetModule
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, type_orm_user_repository_1.TypeOrmUserRepository, mikro_orm_user_repository_1.MikroOrmUserRepository, ...handlers_1.CommandHandlers],
        exports: [user_service_1.UserService, type_orm_user_repository_1.TypeOrmUserRepository, mikro_orm_user_repository_1.MikroOrmUserRepository]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map
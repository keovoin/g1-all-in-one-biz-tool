"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const handlers_1 = require("./commands/handlers");
const reaction_service_1 = require("./reaction.service");
const reaction_controller_1 = require("./reaction.controller");
const reaction_entity_1 = require("./reaction.entity");
const type_orm_reaction_repository_1 = require("./repository/type-orm-reaction.repository");
const mikro_orm_reaction_repository_1 = require("./repository/mikro-orm-reaction.repository");
let ReactionModule = class ReactionModule {
};
exports.ReactionModule = ReactionModule;
exports.ReactionModule = ReactionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([reaction_entity_1.Reaction]),
            nestjs_1.MikroOrmModule.forFeature([reaction_entity_1.Reaction]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule
        ],
        controllers: [reaction_controller_1.ReactionController],
        providers: [reaction_service_1.ReactionService, type_orm_reaction_repository_1.TypeOrmReactionRepository, mikro_orm_reaction_repository_1.MikroOrmReactionRepository, ...handlers_1.CommandHandlers],
        exports: []
    })
], ReactionModule);
//# sourceMappingURL=reaction.module.js.map
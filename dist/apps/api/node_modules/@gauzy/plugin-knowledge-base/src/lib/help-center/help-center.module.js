"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const help_center_controller_1 = require("./help-center.controller");
const help_center_entity_1 = require("./help-center.entity");
const help_center_service_1 = require("./help-center.service");
const handlers_1 = require("./commands/handlers");
const type_orm_help_center_repository_1 = require("./repository/type-orm-help-center.repository");
let HelpCenterModule = class HelpCenterModule {
};
exports.HelpCenterModule = HelpCenterModule;
exports.HelpCenterModule = HelpCenterModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([help_center_entity_1.HelpCenter]),
            nestjs_1.MikroOrmModule.forFeature([help_center_entity_1.HelpCenter]),
            core_1.RolePermissionModule
        ],
        controllers: [help_center_controller_1.HelpCenterController],
        providers: [help_center_service_1.HelpCenterService, type_orm_help_center_repository_1.TypeOrmHelpCenterRepository, ...handlers_1.CommandHandlers],
        exports: [help_center_service_1.HelpCenterService, type_orm_help_center_repository_1.TypeOrmHelpCenterRepository]
    })
], HelpCenterModule);
//# sourceMappingURL=help-center.module.js.map
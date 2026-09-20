"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterAuthorModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const help_center_author_service_1 = require("./help-center-author.service");
const help_center_author_controller_1 = require("./help-center-author.controller");
const help_center_author_entity_1 = require("./help-center-author.entity");
const handlers_1 = require("./commands/handlers");
const type_orm_help_center_author_repository_1 = require("./repository/type-orm-help-center-author.repository");
let HelpCenterAuthorModule = class HelpCenterAuthorModule {
};
exports.HelpCenterAuthorModule = HelpCenterAuthorModule;
exports.HelpCenterAuthorModule = HelpCenterAuthorModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([help_center_author_entity_1.HelpCenterAuthor]),
            nestjs_1.MikroOrmModule.forFeature([help_center_author_entity_1.HelpCenterAuthor]),
            core_1.RolePermissionModule
        ],
        controllers: [help_center_author_controller_1.HelpCenterAuthorController],
        providers: [help_center_author_service_1.HelpCenterAuthorService, type_orm_help_center_author_repository_1.TypeOrmHelpCenterAuthorRepository, ...handlers_1.CommandHandlers],
        exports: [help_center_author_service_1.HelpCenterAuthorService, type_orm_help_center_author_repository_1.TypeOrmHelpCenterAuthorRepository]
    })
], HelpCenterAuthorModule);
//# sourceMappingURL=help-center-author.module.js.map
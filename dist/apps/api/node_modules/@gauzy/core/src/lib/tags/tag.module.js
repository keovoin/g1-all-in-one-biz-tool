"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const internal_1 = require("../core/entities/internal");
const tag_controller_1 = require("./tag.controller");
const tag_service_1 = require("./tag.service");
const tag_entity_1 = require("./tag.entity");
const handlers_1 = require("./commands/handlers");
const type_orm_tag_repository_1 = require("./repository/type-orm-tag.repository");
const mikro_orm_tag_repository_1 = require("./repository/mikro-orm-tag.repository");
let TagModule = class TagModule {
};
exports.TagModule = TagModule;
exports.TagModule = TagModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([tag_entity_1.Tag, internal_1.IntegrationMap]),
            nestjs_1.MikroOrmModule.forFeature([tag_entity_1.Tag, internal_1.IntegrationMap]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [tag_controller_1.TagController],
        providers: [tag_service_1.TagService, type_orm_tag_repository_1.TypeOrmTagRepository, mikro_orm_tag_repository_1.MikroOrmTagRepository, ...handlers_1.CommandHandlers],
        exports: [tag_service_1.TagService, type_orm_tag_repository_1.TypeOrmTagRepository, mikro_orm_tag_repository_1.MikroOrmTagRepository]
    })
], TagModule);
//# sourceMappingURL=tag.module.js.map
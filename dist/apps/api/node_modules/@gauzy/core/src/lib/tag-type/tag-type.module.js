"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagTypeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const tag_type_entity_1 = require("./tag-type.entity");
const tag_type_service_1 = require("./tag-type.service");
const tag_type_controller_1 = require("./tag-type.controller");
const type_orm_tag_type_repository_1 = require("./repository/type-orm-tag-type.repository");
const mikro_orm_tag_type_repository_1 = require("./repository/mikro-orm-tag-type.repository");
let TagTypeModule = class TagTypeModule {
};
exports.TagTypeModule = TagTypeModule;
exports.TagTypeModule = TagTypeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([tag_type_entity_1.TagType]),
            nestjs_1.MikroOrmModule.forFeature([tag_type_entity_1.TagType]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [tag_type_controller_1.TagTypeController],
        providers: [tag_type_service_1.TagTypeService, type_orm_tag_type_repository_1.TypeOrmTagTypeRepository, mikro_orm_tag_type_repository_1.MikroOrmTagTypeRepository],
        exports: [tag_type_service_1.TagTypeService]
    })
], TagTypeModule);
//# sourceMappingURL=tag-type.module.js.map
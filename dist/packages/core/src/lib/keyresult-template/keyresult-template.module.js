"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyresultTemplateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const keyresult_template_controller_1 = require("./keyresult-template.controller");
const keyresult_template_service_1 = require("./keyresult-template.service");
const keyresult_template_entity_1 = require("./keyresult-template.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_keyresult_template_repository_1 = require("./repository/type-orm-keyresult-template.repository");
const mikro_orm_keyresult_template_repository_1 = require("./repository/mikro-orm-keyresult-template.repository");
let KeyresultTemplateModule = class KeyresultTemplateModule {
};
exports.KeyresultTemplateModule = KeyresultTemplateModule;
exports.KeyresultTemplateModule = KeyresultTemplateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([keyresult_template_entity_1.KeyResultTemplate]),
            nestjs_1.MikroOrmModule.forFeature([keyresult_template_entity_1.KeyResultTemplate]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [keyresult_template_controller_1.KeyresultTemplateController],
        providers: [keyresult_template_service_1.KeyresultTemplateService, type_orm_keyresult_template_repository_1.TypeOrmKeyResultTemplateRepository, mikro_orm_keyresult_template_repository_1.MikroOrmKeyResultTemplateRepository]
    })
], KeyresultTemplateModule);
//# sourceMappingURL=keyresult-template.module.js.map
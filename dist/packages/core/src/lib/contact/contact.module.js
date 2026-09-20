"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const contact_entity_1 = require("./contact.entity");
const contact_controller_1 = require("./contact.controller");
const contact_service_1 = require("./contact.service");
const handlers_1 = require("./commands/handlers");
const type_orm_contact_repository_1 = require("./repository/type-orm-contact.repository");
const mikro_orm_contact_repository_1 = require("./repository/mikro-orm-contact.repository");
let ContactModule = class ContactModule {
};
exports.ContactModule = ContactModule;
exports.ContactModule = ContactModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([contact_entity_1.Contact]),
            nestjs_1.MikroOrmModule.forFeature([contact_entity_1.Contact]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [contact_controller_1.ContactController],
        providers: [contact_service_1.ContactService, type_orm_contact_repository_1.TypeOrmContactRepository, mikro_orm_contact_repository_1.MikroOrmContactRepository, ...handlers_1.CommandHandlers],
        exports: [contact_service_1.ContactService]
    })
], ContactModule);
//# sourceMappingURL=contact.module.js.map
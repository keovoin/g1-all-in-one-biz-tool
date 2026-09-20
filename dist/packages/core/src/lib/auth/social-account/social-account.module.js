"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../../user/user.module");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const social_account_service_1 = require("./social-account.service");
const social_account_entity_1 = require("./social-account.entity");
const type_orm_social_account_repository_1 = require("./repository/type-orm-social-account.repository");
const mikro_orm_social_account_repository_1 = require("./repository/mikro-orm-social-account.repository");
let SocialAccountModule = class SocialAccountModule {
};
exports.SocialAccountModule = SocialAccountModule;
exports.SocialAccountModule = SocialAccountModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([social_account_entity_1.SocialAccount]),
            nestjs_1.MikroOrmModule.forFeature([social_account_entity_1.SocialAccount]),
            user_module_1.UserModule,
            role_permission_module_1.RolePermissionModule
        ],
        providers: [social_account_service_1.SocialAccountService, type_orm_social_account_repository_1.TypeOrmSocialAccountRepository, mikro_orm_social_account_repository_1.MikroOrmSocialAccountRepository],
        exports: [social_account_service_1.SocialAccountService]
    })
], SocialAccountModule);
//# sourceMappingURL=social-account.module.js.map
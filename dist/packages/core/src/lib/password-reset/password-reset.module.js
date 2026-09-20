"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const password_reset_entity_1 = require("./password-reset.entity");
const password_reset_service_1 = require("./password-reset.service");
const type_orm_password_reset_repository_1 = require("./repository/type-orm-password-reset.repository");
const mikro_orm_password_reset_repository_1 = require("./repository/mikro-orm-password-reset.repository");
let PasswordResetModule = class PasswordResetModule {
};
exports.PasswordResetModule = PasswordResetModule;
exports.PasswordResetModule = PasswordResetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([password_reset_entity_1.PasswordReset]), nestjs_1.MikroOrmModule.forFeature([password_reset_entity_1.PasswordReset])],
        providers: [
            password_reset_service_1.PasswordResetService,
            type_orm_password_reset_repository_1.TypeOrmPasswordResetRepository,
            mikro_orm_password_reset_repository_1.MikroOrmPasswordResetRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [password_reset_service_1.PasswordResetService, type_orm_password_reset_repository_1.TypeOrmPasswordResetRepository, mikro_orm_password_reset_repository_1.MikroOrmPasswordResetRepository]
    })
], PasswordResetModule);
//# sourceMappingURL=password-reset.module.js.map
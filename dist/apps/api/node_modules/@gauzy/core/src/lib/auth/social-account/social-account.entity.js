"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccount = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../../core/entities/internal");
const entity_1 = require("../../core/decorators/entity");
const mikro_orm_social_account_repository_1 = require("./repository/mikro-orm-social-account.repository");
let SocialAccount = class SocialAccount extends internal_1.TenantBaseEntity {
};
exports.SocialAccount = SocialAccount;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProviderEnum, { message: 'provider `$value` must be a valid enum value' }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], SocialAccount.prototype, "provider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], SocialAccount.prototype, "providerAccountId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], SocialAccount.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], SocialAccount.prototype, "userId", void 0);
exports.SocialAccount = SocialAccount = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('social_account', { mikroOrmRepository: () => mikro_orm_social_account_repository_1.MikroOrmSocialAccountRepository })
], SocialAccount);
//# sourceMappingURL=social-account.entity.js.map
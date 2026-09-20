"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapierWebhookSubscription = void 0;
const tslib_1 = require("tslib");
// External imports
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const mikro_orm_zapier_webhook_subscription_repository_1 = require("./repository/mikro-orm-zapier-webhook-subscription.repository");
let ZapierWebhookSubscription = class ZapierWebhookSubscription extends core_1.TenantOrganizationBaseEntity {
};
exports.ZapierWebhookSubscription = ZapierWebhookSubscription;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ZapierWebhookSubscription.prototype, "targetUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ZapierWebhookSubscription.prototype, "event", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.IntegrationTenant, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ZapierWebhookSubscription.prototype, "integration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integration),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], ZapierWebhookSubscription.prototype, "integrationId", void 0);
exports.ZapierWebhookSubscription = ZapierWebhookSubscription = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('zapier_webhook_subscription', {
        mikroOrmRepository: () => mikro_orm_zapier_webhook_subscription_repository_1.MikroOrmZapierWebhookSubscriptionRepository
    })
], ZapierWebhookSubscription);
//# sourceMappingURL=zapier-webhook-subscription.entity.js.map
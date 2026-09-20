"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBilling = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_subscription_entity_1 = require("./plugin-subscription.entity");
let PluginBilling = class PluginBilling extends core_1.TenantOrganizationBaseEntity {
    /*
     * Computed properties and helper methods
     */
    /**
     * Check if billing is overdue
     */
    get isOverdue() {
        return this.status === contracts_1.PluginBillingStatus.PENDING && this.dueDate < new Date();
    }
    /**
     * Check if billing is pending
     */
    get isPending() {
        return this.status === contracts_1.PluginBillingStatus.PENDING;
    }
    /**
     * Get days until due date
     */
    get daysUntilDue() {
        const now = new Date();
        const timeDiff = this.dueDate.getTime() - now.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
};
exports.PluginBilling = PluginBilling;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Billing amount' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Amount must be greater than or equal to 0' }),
    (0, core_1.MultiORMColumn)({ type: 'decimal', precision: 10, scale: 2 }),
    tslib_1.__metadata("design:type", Number)
], PluginBilling.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Currency code' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Currency is required' }),
    (0, class_validator_1.IsString)({ message: 'Currency must be a string' }),
    (0, core_1.MultiORMColumn)({ default: 'USD' }),
    tslib_1.__metadata("design:type", String)
], PluginBilling.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Billing date' }),
    (0, class_validator_1.IsDate)({ message: 'Billing date must be a valid date' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], PluginBilling.prototype, "billingDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Due date for payment' }),
    (0, class_validator_1.IsDate)({ message: 'Due date must be a valid date' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], PluginBilling.prototype, "dueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginBillingStatus, description: 'Billing status' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingStatus, { message: 'Invalid billing status' }),
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginBillingStatus,
        default: contracts_1.PluginBillingStatus.PENDING
    }),
    tslib_1.__metadata("design:type", String)
], PluginBilling.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginBillingPeriod, description: 'Billing period' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod, { message: 'Invalid billing period' }),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.PluginBillingPeriod }),
    tslib_1.__metadata("design:type", String)
], PluginBilling.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Billing period start date' }),
    (0, class_validator_1.IsDate)({ message: 'Billing period start must be a valid date' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], PluginBilling.prototype, "billingPeriodStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Billing period end date' }),
    (0, class_validator_1.IsDate)({ message: 'Billing period end must be a valid date' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], PluginBilling.prototype, "billingPeriodEnd", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Billing description/notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginBilling.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Billing metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginBilling.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Associated subscription ID' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Subscription ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', relationId: true }),
    (0, typeorm_1.RelationId)((billing) => billing.subscription),
    tslib_1.__metadata("design:type", String)
], PluginBilling.prototype, "subscriptionId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => plugin_subscription_entity_1.PluginSubscription, (subscription) => subscription.billings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginBilling.prototype, "subscription", void 0);
exports.PluginBilling = PluginBilling = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('plugin_billings')
], PluginBilling);
//# sourceMappingURL=plugin-billing.entity.js.map
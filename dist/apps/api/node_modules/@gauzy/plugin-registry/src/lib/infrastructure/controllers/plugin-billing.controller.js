"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plugin_billing_service_1 = require("../../domain/services/plugin-billing.service");
const create_plugin_billing_dto_1 = require("../../shared/dto/create-plugin-billing.dto");
const update_plugin_billing_dto_1 = require("../../shared/dto/update-plugin-billing.dto");
let PluginBillingController = class PluginBillingController {
    constructor(pluginBillingService) {
        this.pluginBillingService = pluginBillingService;
    }
    /**
     * Create a new plugin billing record
     */
    async create(input) {
        return this.pluginBillingService.create(input);
    }
    /**
     * Get all plugin billing records
     */
    async findAll(pluginId, subscriptionId, status, options) {
        // Build search criteria
        const searchOptions = {
            ...options,
            subscriptionId
        };
        // Handle status filter
        if (status === 'overdue') {
            const overdueResults = await this.pluginBillingService.getOverdueBillings();
            return {
                items: overdueResults.filter((bill) => bill.subscriptionId === subscriptionId),
                total: overdueResults.filter((bill) => bill.subscriptionId === subscriptionId).length
            };
        }
        if (status) {
            // Map string status to enum
            const statusMap = {
                overdue: contracts_1.PluginBillingStatus.OVERDUE,
                paid: contracts_1.PluginBillingStatus.PAID,
                pending: contracts_1.PluginBillingStatus.PENDING,
                failed: contracts_1.PluginBillingStatus.FAILED
            };
            searchOptions.status = statusMap[status];
        }
        const hasFilters = Object.keys(searchOptions).length > 0;
        if (hasFilters) {
            const result = await this.pluginBillingService.findBillings(searchOptions);
            return {
                items: result,
                total: result.length
            };
        }
        return this.pluginBillingService.findAll();
    }
    /**
     * Get billing summary for a subscription
     */
    async getBillingSummary(pluginId, subscriptionId) {
        return this.pluginBillingService.getBillingSummary(subscriptionId);
    }
    /**
     * Get plugin billing record by ID
     */
    async findOne(id) {
        return this.pluginBillingService.findOneByIdString(id);
    }
    /**
     * Update plugin billing record
     */
    async update(id, input) {
        await this.pluginBillingService.update(id, input);
        return await this.pluginBillingService.findOneByIdString(id);
    }
    /**
     * Update billing record status
     */
    async updateStatus(pluginId, subscriptionId, id, input) {
        if (input.status === 'paid') {
            await this.pluginBillingService.markAsPaid(id, input.paymentReference);
        }
        else if (input.status === 'failed') {
            await this.pluginBillingService.markAsFailed(id, input.reason);
        }
        else {
            // General status update
            await this.pluginBillingService.update(id, { status: input.status });
        }
        return await this.pluginBillingService.findOneByIdString(id);
    }
};
exports.PluginBillingController = PluginBillingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create plugin billing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plugin billing record created successfully',
        type: 'IPluginBilling'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_plugin_billing_dto_1.CreatePluginBillingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginBillingController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all plugin billing records' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'subscriptionId', description: 'Subscription ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by billing status (overdue, paid, pending, failed)'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin billing records retrieved successfully'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('subscriptionId', core_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Query)('status')),
    tslib_1.__param(3, (0, common_1.Query)(new common_1.ValidationPipe({ whitelist: true, transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginBillingController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get billing summary for subscription' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'subscriptionId', description: 'Subscription ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Billing summary retrieved successfully'
    }),
    (0, common_1.Get)('summary'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('subscriptionId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginBillingController.prototype, "getBillingSummary", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin billing record by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin billing record retrieved successfully'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginBillingController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update plugin billing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin billing record updated successfully'
    }),
    (0, common_1.Put)(':id'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, update_plugin_billing_dto_1.UpdatePluginBillingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginBillingController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update billing record status' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'subscriptionId', description: 'Subscription ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Billing record ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Billing record status updated successfully'
    }),
    (0, common_1.Patch)(':id'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('subscriptionId', core_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(3, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginBillingController.prototype, "updateStatus", null);
exports.PluginBillingController = PluginBillingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('plugins/:pluginId/subscriptions/:subscriptionId/billings'),
    tslib_1.__metadata("design:paramtypes", [plugin_billing_service_1.PluginBillingService])
], PluginBillingController);
//# sourceMappingURL=plugin-billing.controller.js.map
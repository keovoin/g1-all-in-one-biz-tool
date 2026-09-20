"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicInvoiceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const pipes_1 = require("../../shared/pipes");
const public_transform_interceptor_1 = require("./../public-transform.interceptor");
const queries_1 = require("./queries");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let PublicInvoiceController = class PublicInvoiceController {
    constructor(queryBus, commandBus) {
        this.queryBus = queryBus;
        this.commandBus = commandBus;
    }
    /**
     * GET invoice by token
     *
     * @param params
     * @param query
     * @returns
     */
    async findOneByPublicLink(params, query) {
        return await this.queryBus.execute(new queries_1.FindPublicInvoiceQuery(params, query.relations));
    }
    /**
     * Update public estimate/invoice status
     *
     * @param params
     * @param entity
     * @returns
     */
    async updateInvoiceByEstimateEmailToken(params, entity) {
        return await this.commandBus.execute(new commands_1.PublicInvoiceUpdateCommand(params, entity));
    }
};
exports.PublicInvoiceController = PublicInvoiceController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Invoice by invoice token.' }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Found one record'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id/:token'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.PublicInvoiceQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicInvoiceController.prototype, "findOneByPublicLink", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Estimate by estimate token.' }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.ACCEPTED,
        description: 'Estimate updated successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Record not found.'
    }),
    (0, common_1.Put)(':id/:token'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.PublicEstimateUpdateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicInvoiceController.prototype, "updateInvoiceByEstimateEmailToken", null);
exports.PublicInvoiceController = PublicInvoiceController = tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.UseInterceptors)(public_transform_interceptor_1.PublicTransformInterceptor),
    (0, common_1.Controller)('/public/invoice'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus, cqrs_1.CommandBus])
], PublicInvoiceController);
//# sourceMappingURL=public-invoice.controller.js.map
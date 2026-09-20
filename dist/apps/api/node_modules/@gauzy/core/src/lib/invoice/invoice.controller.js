"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_i18n_1 = require("nestjs-i18n");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const invoice_service_1 = require("./invoice.service");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let InvoiceController = class InvoiceController extends crud_1.CrudController {
    constructor(invoiceService, commandBus) {
        super(invoiceService);
        this.invoiceService = invoiceService;
        this.commandBus = commandBus;
    }
    /**
     * GET invoice count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.invoiceService.countBy(options);
    }
    /**
     * GET invoices by pagination params
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        return await this.invoiceService.pagination(options);
    }
    /**
     * GET highest invoice number
     *
     * @returns
     */
    async findHighestInvoiceNumber() {
        return await this.invoiceService.getHighestInvoiceNumber();
    }
    /**
     * GET all invoices
     *
     * @param options
     * @returns
     */
    async findAll(options) {
        try {
            return await this.invoiceService.findAll(options);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET invoice by ID
     *
     * @param id
     * @param data
     * @returns
     */
    async findById(id, data) {
        const { relations = [], findInput = null } = data;
        return this.invoiceService.findOneByIdString(id, {
            where: findInput,
            relations
        });
    }
    /**
     * Create invoice
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.InvoiceCreateCommand(entity));
    }
    /**
     * Update invoice
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.InvoiceUpdateCommand({ ...entity, id }));
    }
    /**
     * Update estimate status
     *
     * @param id
     * @param entity
     * @returns
     */
    async updateEstimate(id, entity) {
        return await this.commandBus.execute(new commands_1.InvoiceUpdateCommand({ ...entity, id }));
    }
    /**
     * Update invoice/estimate action
     *
     * @param id
     * @param entity
     * @returns
     */
    async updateAction(id, entity) {
        return await this.commandBus.execute(new commands_1.InvoiceUpdateCommand({ ...entity, id }));
    }
    /**
     * Send estimate/invoice email
     *
     * @param email
     * @param body
     * @param languageCode
     * @param originalUrl
     * @returns
     */
    async emailInvoice(email, body, languageCode, origin) {
        return this.commandBus.execute(new commands_1.InvoiceSendEmailCommand(languageCode, email, body.params, origin));
    }
    /**
     * Generate invoice/estimate public link
     *
     * @param uuid
     * @returns
     */
    async generateLink(uuid) {
        return await this.commandBus.execute(new commands_1.InvoiceGenerateLinkCommand(uuid));
    }
    async delete(id) {
        return await this.commandBus.execute(new commands_1.InvoiceDeleteCommand(id));
    }
    /**
     * Download invoice pdf
     *
     * @param uuid
     * @param locale
     * @param res
     * @returns
     */
    async downloadInvoicePdf(uuid, locale, res) {
        const buffer = await this.commandBus.execute(new commands_1.InvoiceGeneratePdfCommand(uuid, locale));
        if (!buffer) {
            return;
        }
        const stream = this.invoiceService.getReadableStream(buffer);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length
        });
        stream.pipe(res);
    }
    /**
     * Download invoice payment pdf
     *
     * @param uuid
     * @param locale
     * @param res
     * @returns
     */
    async downloadInvoicePaymentPdf(uuid, locale, res) {
        const buffer = await this.commandBus.execute(new commands_1.InvoicePaymentGeneratePdfCommand(uuid, locale));
        if (!buffer) {
            return;
        }
        const stream = this.invoiceService.getReadableStream(buffer);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length
        });
        stream.pipe(res);
    }
};
exports.InvoiceController = InvoiceController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)('count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)('highest'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "findHighestInvoiceNumber", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateInvoiceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateInvoiceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update estimate invoice' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id/estimate'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateEstimateInvoiceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateEstimate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update Invoice's Status" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id/action'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateInvoiceActionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateAction", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('email/:email'),
    tslib_1.__param(0, (0, common_1.Param)('email')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__param(3, (0, common_1.Headers)('origin')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "emailInvoice", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('generate/:uuid'),
    tslib_1.__param(0, (0, common_1.Param)('uuid', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "generateLink", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Download Invoice' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The invoice has been successfully downloaded'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Invoice not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)('download/:uuid'),
    tslib_1.__param(0, (0, common_1.Param)('uuid', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "downloadInvoicePdf", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Download Invoice' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The invoice has been successfully downloaded'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Invoice not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)('payment/download/:uuid'),
    tslib_1.__param(0, (0, common_1.Param)('uuid', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceController.prototype, "downloadInvoicePaymentPdf", null);
exports.InvoiceController = InvoiceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Invoice'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_EDIT),
    (0, common_1.Controller)('/invoices'),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService, cqrs_1.CommandBus])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map
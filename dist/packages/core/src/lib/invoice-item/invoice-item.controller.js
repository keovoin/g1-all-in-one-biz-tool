"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const invoice_item_service_1 = require("./invoice-item.service");
const commands_1 = require("./commands");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./dto");
let InvoiceItemController = class InvoiceItemController extends crud_1.CrudController {
    constructor(invoiceItemService, commandBus) {
        super(invoiceItemService);
        this.invoiceItemService = invoiceItemService;
        this.commandBus = commandBus;
    }
    async findAll(data) {
        const { relations = [], findInput = null } = data;
        return this.invoiceItemService.findAll({
            where: findInput,
            relations
        });
    }
    async createBulk(invoiceId, input) {
        return this.commandBus.execute(new commands_1.InvoiceItemBulkCreateCommand(invoiceId, input.list));
    }
};
exports.InvoiceItemController = InvoiceItemController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create invoice item in Bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Invoice item have been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_EDIT),
    (0, common_1.Post)('/bulk/:invoiceId'),
    tslib_1.__param(0, (0, common_1.Param)('invoiceId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)(pipes_1.BulkBodyLoadTransformPipe, new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.InvoiceItemBulkInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceItemController.prototype, "createBulk", null);
exports.InvoiceItemController = InvoiceItemController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('InvoiceItem'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/invoice-item'),
    tslib_1.__metadata("design:paramtypes", [invoice_item_service_1.InvoiceItemService, cqrs_1.CommandBus])
], InvoiceItemController);
//# sourceMappingURL=invoice-item.controller.js.map
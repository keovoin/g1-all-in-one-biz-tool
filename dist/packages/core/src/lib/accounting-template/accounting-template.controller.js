"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingTemplateController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const queries_1 = require("./queries");
const accounting_template_entity_1 = require("./accounting-template.entity");
const accounting_template_service_1 = require("./accounting-template.service");
const dto_1 = require("./dto");
let AccountingTemplateController = class AccountingTemplateController extends crud_1.CrudController {
    constructor(accountingTemplateService, queryBus) {
        super(accountingTemplateService);
        this.accountingTemplateService = accountingTemplateService;
        this.queryBus = queryBus;
    }
    /**
     * GET count for accounting template
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.accountingTemplateService.countBy(options);
    }
    /**
     * GET accounting templates using pagination params
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        return await this.accountingTemplateService.paginate(options);
    }
    /**
     * GET accounting template
     *
     * @param options
     * @param themeLanguage
     * @returns
     */
    async getAccountingTemplate(options, themeLanguage) {
        return await this.accountingTemplateService.getAccountTemplate(options, themeLanguage);
    }
    async generatePreview(input) {
        return this.accountingTemplateService.generatePreview(input);
    }
    /**
     * Save accounting template to the organization
     *
     * @param entity
     * @returns
     */
    async saveTemplate(entity) {
        try {
            return await this.accountingTemplateService.saveTemplate(entity);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async findAll(options) {
        return await this.queryBus.execute(new queries_1.AccountingTemplateQuery(options));
    }
    async findById(id) {
        try {
            return await this.accountingTemplateService.findOneByIdString(id);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async update(id, input) {
        try {
            await this.accountingTemplateService.create({ ...input, id });
            return await this.findById(id);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async delete(id) {
        try {
            return await this.accountingTemplateService.delete(id);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.AccountingTemplateController = AccountingTemplateController;
tslib_1.__decorate([
    (0, common_1.Get)('/count'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find template by name and language code for organization'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found template',
        type: accounting_template_entity_1.AccountingTemplate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/template'),
    (0, pipes_1.UseValidationPipe)({
        transform: true,
        whitelist: true
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.AccountingTemplateQueryDTO, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "getAccountingTemplate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Converts mjml or handlebar text to html for template preview'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'text converted to html',
        type: accounting_template_entity_1.AccountingTemplate
    }),
    (0, common_1.Post)('/template/preview'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "generatePreview", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Converts mjml or handlebar text to html for template preview'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'text converted to html',
        type: accounting_template_entity_1.AccountingTemplate
    }),
    (0, common_1.Post)('/template/save'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.SaveAccountingTemplateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "saveTemplate", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Gets template by id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'template found',
        type: accounting_template_entity_1.AccountingTemplate
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Updates template'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'template updated',
        type: accounting_template_entity_1.AccountingTemplate
    }),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete accounting template'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Accounting template deleted',
        type: accounting_template_entity_1.AccountingTemplate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Accounting template not found'
    }),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingTemplateController.prototype, "delete", null);
exports.AccountingTemplateController = AccountingTemplateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Accounting Template'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_ALL_ACCOUNTING_TEMPLATES),
    (0, common_1.Controller)('/accounting-template'),
    tslib_1.__metadata("design:paramtypes", [accounting_template_service_1.AccountingTemplateService,
        cqrs_1.QueryBus])
], AccountingTemplateController);
//# sourceMappingURL=accounting-template.controller.js.map
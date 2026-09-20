"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const email_template_entity_1 = require("./email-template.entity");
const email_template_service_1 = require("./email-template.service");
const queries_1 = require("./queries");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let EmailTemplateController = class EmailTemplateController extends crud_1.CrudController {
    constructor(emailTemplateService, queryBus, commandBus) {
        super(emailTemplateService);
        this.emailTemplateService = emailTemplateService;
        this.queryBus = queryBus;
        this.commandBus = commandBus;
    }
    /**
     * GET count for email templates in the same tenant
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.emailTemplateService.countBy({
            ...options,
            tenantId: context_1.RequestContext.currentTenantId()
        });
    }
    /**
     * GET email templates using pagination params
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        return await this.emailTemplateService.paginate(options);
    }
    /**
     * GET specific email template by conditions
     *
     * @param themeLanguage
     * @param options
     * @returns
     */
    async findEmailTemplate(themeLanguage, options) {
        return await this.queryBus.execute(new queries_1.FindEmailTemplateQuery(options, themeLanguage));
    }
    /**
     * Generate email template preview
     *
     * @param data
     * @returns
     */
    async generatePreview(data) {
        return await this.queryBus.execute(new queries_1.EmailTemplateGeneratePreviewQuery(data));
    }
    /**
     * SAVE email template for specific language
     *
     * @param entity
     * @returns
     */
    async saveEmailTemplate(entity) {
        return await this.commandBus.execute(new commands_1.EmailTemplateSaveCommand(entity));
    }
    /**
     * GET email templates in the same tenant
     *
     * @param options
     * @returns
     */
    async findAll(options) {
        return await this.queryBus.execute(new queries_1.EmailTemplateQuery(options));
    }
    /**
     * FIND email template by id in the same tenant
     *
     * @param id
     * @returns
     */
    async findById(id) {
        try {
            return await this.emailTemplateService.findOneByIdString(id, {
                where: {
                    tenantId: context_1.RequestContext.currentTenantId()
                }
            });
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    /**
     * UPDATE email template by id in the same tenant
     *
     * @param id
     * @param input
     * @returns
     */
    async update(id, input) {
        try {
            await this.findById(id);
            return await this.emailTemplateService.update({
                id,
                tenantId: context_1.RequestContext.currentTenantId()
            }, input);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    /**
     * DELETE email template by id in the same tenant
     *
     * @param id
     * @returns
     */
    async delete(id) {
        try {
            await this.findById(id);
            return await this.emailTemplateService.delete({
                id,
                tenantId: context_1.RequestContext.currentTenantId()
            });
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.EmailTemplateController = EmailTemplateController;
tslib_1.__decorate([
    (0, common_1.Get)('count'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find email template by name and language code for organization'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found email template',
        type: email_template_entity_1.EmailTemplate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('template'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.EmailTemplateQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "findEmailTemplate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Converts mjml or handlebar text to html for email preview'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'text converted to html',
        type: email_template_entity_1.EmailTemplate
    }),
    (0, common_1.Post)('template/preview'),
    tslib_1.__param(0, (0, common_1.Body)('data')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "generatePreview", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Convert mjml or handlebar text to html'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'mjml or handlebar text converted to html',
        type: email_template_entity_1.EmailTemplate
    }),
    (0, common_1.Post)('template/save'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.SaveEmailTemplateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "saveEmailTemplate", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Gets template by id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'template found',
        type: email_template_entity_1.EmailTemplate
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Updates template'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'template updated',
        type: email_template_entity_1.EmailTemplate
    }),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete email template'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Email template deleted',
        type: email_template_entity_1.EmailTemplate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Email template not found'
    }),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailTemplateController.prototype, "delete", null);
exports.EmailTemplateController = EmailTemplateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmailTemplate'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_ALL_EMAIL_TEMPLATES),
    (0, common_1.Controller)('/email-template'),
    tslib_1.__metadata("design:paramtypes", [email_template_service_1.EmailTemplateService,
        cqrs_1.QueryBus,
        cqrs_1.CommandBus])
], EmailTemplateController);
//# sourceMappingURL=email-template.controller.js.map
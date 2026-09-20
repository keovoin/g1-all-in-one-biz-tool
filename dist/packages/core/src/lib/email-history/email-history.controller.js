"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHistoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const email_history_entity_1 = require("./email-history.entity");
const email_history_service_1 = require("./email-history.service");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const dto_1 = require("./dto");
const crud_1 = require("./../core/crud");
const resend_email_history_dto_1 = require("./dto/resend-email-history.dto");
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("./commands");
let EmailHistoryController = class EmailHistoryController {
    constructor(_emailHistoryService, commandBus) {
        this._emailHistoryService = _emailHistoryService;
        this.commandBus = commandBus;
    }
    /**
     * Retrieves all sent emails for a specific tenant with pagination.
     *
     * @param params - Pagination and filter parameters.
     * @returns A paginated list of email histories.
     */
    async findAll(params) {
        return await this._emailHistoryService.findAll(params);
    }
    /**
     * Update an existing email history record.
     *
     * @param id - The UUID of the record to update.
     * @param entity - The update payload.
     * @returns The updated email history record or update result.
     * @throws NotFoundException if no record exists with the given ID.
     * @throws BadRequestException if the update fails due to invalid input.
     */
    async update(id, entity) {
        return await this._emailHistoryService.update(id, entity);
    }
    /**
     * Resend an email invitation.
     *
     * @param entity - The DTO containing the email details to be resent.
     * @param languageCode - The language code to determine the email content language.
     * @returns The update result or updated email history record.
     */
    async resendInvite(id, entity, languageCode) {
        return await this.commandBus.execute(new commands_1.EmailHistoryResendCommand(id, entity, languageCode));
    }
};
exports.EmailHistoryController = EmailHistoryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all sent emails under specific tenant.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Found emails',
        type: email_history_entity_1.EmailHistory
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No records found'
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailHistoryController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateEmailHistoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailHistoryController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Resend Email.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong.'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Post)('/resend/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, resend_email_history_dto_1.ResendEmailHistoryDTO, String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailHistoryController.prototype, "resendInvite", null);
exports.EmailHistoryController = EmailHistoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Email'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_ALL_EMAILS),
    (0, common_1.Controller)('/email'),
    tslib_1.__metadata("design:paramtypes", [email_history_service_1.EmailHistoryService, cqrs_1.CommandBus])
], EmailHistoryController);
//# sourceMappingURL=email-history.controller.js.map
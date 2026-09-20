"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const contact_entity_1 = require("./contact.entity");
const contact_service_1 = require("./contact.service");
let ContactController = class ContactController extends crud_1.CrudController {
    constructor(contactService) {
        super(contactService);
        this.contactService = contactService;
    }
    async findAll(data) {
        const { relations, findInput } = data;
        return this.contactService.findAll({ where: findInput, relations });
    }
};
exports.ContactController = ContactController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all contacts.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found contact',
        type: contact_entity_1.Contact
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContactController.prototype, "findAll", null);
exports.ContactController = ContactController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Contact'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/contact'),
    tslib_1.__metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map
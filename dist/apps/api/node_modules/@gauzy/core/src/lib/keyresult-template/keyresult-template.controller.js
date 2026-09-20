"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyresultTemplateController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const keyresult_template_entity_1 = require("./keyresult-template.entity");
const keyresult_template_service_1 = require("./keyresult-template.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let KeyresultTemplateController = class KeyresultTemplateController extends crud_1.CrudController {
    constructor(keyResultTemplateService) {
        super(keyResultTemplateService);
        this.keyResultTemplateService = keyResultTemplateService;
    }
    /**
     * GET key result templates
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return this.keyResultTemplateService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * CREATE key result template
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.keyResultTemplateService.create(entity);
    }
};
exports.KeyresultTemplateController = KeyresultTemplateController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find key result templates.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found key result templates',
        type: keyresult_template_entity_1.KeyResultTemplate
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
], KeyresultTemplateController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create KeyResult Template' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'KeyResult Template Created successfully',
        type: keyresult_template_entity_1.KeyResultTemplate
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateKeyresultTemplateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyresultTemplateController.prototype, "create", null);
exports.KeyresultTemplateController = KeyresultTemplateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('keyResultTemplate'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/key-result-templates'),
    tslib_1.__metadata("design:paramtypes", [keyresult_template_service_1.KeyresultTemplateService])
], KeyresultTemplateController);
//# sourceMappingURL=keyresult-template.controller.js.map
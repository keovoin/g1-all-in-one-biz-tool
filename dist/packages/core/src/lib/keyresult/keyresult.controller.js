"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const keyresult_entity_1 = require("./keyresult.entity");
const crud_1 = require("./../core/crud");
const keyresult_service_1 = require("./keyresult.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let KeyResultController = class KeyResultController extends crud_1.CrudController {
    constructor(keyResultService) {
        super(keyResultService);
        this.keyResultService = keyResultService;
    }
    async create(entity) {
        return this.keyResultService.create(entity);
    }
    async createBulkKeyResults(entity) {
        return this.keyResultService.createBulk(entity.list);
    }
    async getAll(findInput) {
        return this.keyResultService.findAll({
            where: { id: findInput },
            relations: ['updates', 'goal', 'lead', 'owner']
        });
    }
    async update(id, entity) {
        //We are using create here because create calls the method save()
        //We need save() to save ManyToMany relations
        return await this.keyResultService.create({ ...entity, id });
    }
    async delete(id) {
        return this.keyResultService.delete(id);
    }
};
exports.KeyResultController = KeyResultController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a key result' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Key Result Created',
        type: keyresult_entity_1.KeyResult
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Key Result not found'
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateKeyResultDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Bulk key result' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Key Results Created',
        type: keyresult_entity_1.KeyResult
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Key Result not found'
    }),
    (0, common_1.Post)('/bulk'),
    tslib_1.__param(0, (0, common_1.Body)(pipes_1.BulkBodyLoadTransformPipe, new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.KeyResultBulkInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultController.prototype, "createBulkKeyResults", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get key result by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found Key Result',
        type: keyresult_entity_1.KeyResult
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Key Result not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing keyresult' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The keyresult has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Key Result not found'
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
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateKeyResultDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultController.prototype, "delete", null);
exports.KeyResultController = KeyResultController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('KeyResults'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/key-results'),
    tslib_1.__metadata("design:paramtypes", [keyresult_service_1.KeyResultService])
], KeyResultController);
//# sourceMappingURL=keyresult.controller.js.map
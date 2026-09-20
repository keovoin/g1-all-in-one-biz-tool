"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultUpdateController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const keyresult_update_entity_1 = require("./keyresult-update.entity");
const keyresult_update_service_1 = require("./keyresult-update.service");
const pipes_1 = require("./../shared/pipes");
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("./commands");
const guards_1 = require("./../shared/guards");
const dto_1 = require("./dto");
let KeyResultUpdateController = class KeyResultUpdateController extends crud_1.CrudController {
    constructor(commandBus, keyResultUpdateService) {
        super(keyResultUpdateService);
        this.commandBus = commandBus;
        this.keyResultUpdateService = keyResultUpdateService;
    }
    async create(entity) {
        return this.keyResultUpdateService.create(entity);
    }
    async getAll(id) {
        return this.keyResultUpdateService.findAll({
            where: { keyResultId: id },
            relations: ['keyResult']
        });
    }
    async update(id, entity) {
        //We are using create here because create calls the method save()
        //We need save() to save ManyToMany relations
        try {
            return await this.keyResultUpdateService.create({ ...entity, id });
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async deleteBulkByKeyResultId(data) {
        const { id = null } = data;
        return this.commandBus.execute(new commands_1.KeyResultUpdateBulkDeleteCommand(id));
    }
};
exports.KeyResultUpdateController = KeyResultUpdateController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create an update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Update created',
        type: keyresult_update_entity_1.KeyResultUpdate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateKeyresultUpdateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultUpdateController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all updates of keyresult' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found updates',
        type: keyresult_update_entity_1.KeyResultUpdate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Updates not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultUpdateController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing keyresult update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The update has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Update not found'
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
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateKeyresultUpdateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultUpdateController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete updates by Key Result Id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Found key result's updates",
        type: keyresult_update_entity_1.KeyResultUpdate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'updates not found'
    }),
    (0, common_1.Delete)('deleteBulkByKeyResultId'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], KeyResultUpdateController.prototype, "deleteBulkByKeyResultId", null);
exports.KeyResultUpdateController = KeyResultUpdateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('KeyResultsUpdate'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/key-result-updates'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        keyresult_update_service_1.KeyResultUpdateService])
], KeyResultUpdateController);
//# sourceMappingURL=keyresult-update.controller.js.map
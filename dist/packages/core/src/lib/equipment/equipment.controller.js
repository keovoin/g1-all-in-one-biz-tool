"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentController = void 0;
const tslib_1 = require("tslib");
const crud_1 = require("./../core/crud");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const equipment_entity_1 = require("./equipment.entity");
const equipment_service_1 = require("./equipment.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let EquipmentController = class EquipmentController extends crud_1.CrudController {
    constructor(equipmentService) {
        super(equipmentService);
        this.equipmentService = equipmentService;
    }
    async pagination(filter) {
        return this.equipmentService.pagination(filter);
    }
    async findAll(data) {
        const { relations, findInput } = data;
        return await this.equipmentService.findAll({
            where: {
                ...findInput
            },
            relations
        });
    }
    async create(entity) {
        //We are using create here because create calls the method save()
        //We need save() to save ManyToMany relations
        return await this.equipmentService.create(entity);
    }
    async update(id, entity) {
        //We are using create here because create calls the method save()
        //We need save() to save ManyToMany relations
        return await this.equipmentService.create({ ...entity, id });
    }
};
exports.EquipmentController = EquipmentController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all equipment sharings by pagination'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_entity_1.Equipment
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all equipment sharings'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_entity_1.Equipment
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
], EquipmentController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'New equipment record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateEquipmentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing equipment' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateEquipmentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentController.prototype, "update", null);
exports.EquipmentController = EquipmentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Equipment'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/equipment'),
    tslib_1.__metadata("design:paramtypes", [equipment_service_1.EquipmentService])
], EquipmentController);
//# sourceMappingURL=equipment.controller.js.map
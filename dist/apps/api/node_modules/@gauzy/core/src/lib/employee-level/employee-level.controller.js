"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLevelController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const employee_level_entity_1 = require("./employee-level.entity");
const employee_level_service_1 = require("./employee-level.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
let EmployeeLevelController = class EmployeeLevelController extends crud_1.CrudController {
    constructor(employeeLevelService) {
        super(employeeLevelService);
        this.employeeLevelService = employeeLevelService;
    }
    async findAll(data) {
        const { relations, findInput } = data;
        return await this.employeeLevelService.findAll({
            where: {
                ...findInput
            },
            relations
        });
    }
    async update(id, entity, ...options) {
        try {
            return this.employeeLevelService.create({ ...entity, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.EmployeeLevelController = EmployeeLevelController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeLevelController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, employee_level_entity_1.EmployeeLevel, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeLevelController.prototype, "update", null);
exports.EmployeeLevelController = EmployeeLevelController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeLevel'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/employee-level'),
    tslib_1.__metadata("design:paramtypes", [employee_level_service_1.EmployeeLevelService])
], EmployeeLevelController);
//# sourceMappingURL=employee-level.controller.js.map
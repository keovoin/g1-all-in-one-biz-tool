"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficialHolidayController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
const official_holiday_service_1 = require("./official-holiday.service");
/**
 * Official holidays per country (issue #314).
 *
 * Reuses the Time Off policy permissions: an official holiday list is organization-level Time Off
 * configuration, managed by the same people who manage the policies.
 */
let OfficialHolidayController = class OfficialHolidayController {
    constructor(officialHolidayService) {
        this.officialHolidayService = officialHolidayService;
    }
    /**
     * List the official holidays of an organization, optionally by country and year.
     *
     * @param options the country code and/or calendar year to filter by
     * @returns the matching holidays, earliest first
     */
    async findAll(options) {
        return this.officialHolidayService.findAllByFilter(options);
    }
    /**
     * Get one official holiday by id.
     *
     * @param id the holiday to read
     * @returns the holiday
     */
    async findById(id) {
        return this.officialHolidayService.findOneByIdString(id);
    }
    /**
     * Create an official holiday.
     *
     * @param entity the holiday to create
     * @returns the created holiday
     */
    async create(entity) {
        return this.officialHolidayService.create(entity);
    }
    /**
     * Update an official holiday.
     *
     * @param id the holiday to update
     * @param entity the fields to change
     * @returns the updated holiday
     */
    async update(id, entity) {
        return this.officialHolidayService.update(id, entity);
    }
    /**
     * Delete an official holiday.
     *
     * @param id the holiday to delete
     * @returns the delete result
     */
    async delete(id) {
        return this.officialHolidayService.delete(id);
    }
};
exports.OfficialHolidayController = OfficialHolidayController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find official holidays' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found official holidays' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_POLICY_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.OfficialHolidayQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OfficialHolidayController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find an official holiday by id' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found the holiday' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_POLICY_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OfficialHolidayController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create an official holiday' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The holiday has been created.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input, check the response body for details' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_ADD),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateOfficialHolidayDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OfficialHolidayController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an official holiday' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The holiday has been updated.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOfficialHolidayDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OfficialHolidayController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete an official holiday' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'The holiday has been deleted.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_DELETE),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OfficialHolidayController.prototype, "delete", null);
exports.OfficialHolidayController = OfficialHolidayController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OfficialHoliday'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_EDIT),
    (0, common_1.Controller)('/official-holiday'),
    tslib_1.__metadata("design:paramtypes", [official_holiday_service_1.OfficialHolidayService])
], OfficialHolidayController);
//# sourceMappingURL=official-holiday.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAvailabilityController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const pipes_1 = require("../shared/pipes");
const employee_availability_service_1 = require("./employee-availability.service");
const commands_1 = require("./commands");
const create_employee_availability_dto_1 = require("./dto/create-employee-availability.dto");
const update_employee_availability_dto_1 = require("./dto/update-employee-availability.dto");
let EmployeeAvailabilityController = class EmployeeAvailabilityController extends crud_1.CrudController {
    constructor(availabilityService, commandBus) {
        super(availabilityService);
        this.availabilityService = availabilityService;
        this.commandBus = commandBus;
    }
    /**
     * Create multiple employee availability records in bulk.
     *
     * @param entities List of availability records to create
     * @returns The created availability records
     */
    async createBulk(entities) {
        return await this.commandBus.execute(new commands_1.EmployeeAvailabilityBulkCreateCommand(entities));
    }
    /**
     * Retrieve all employee availability records.
     *
     * @param data Query parameters, including relations and filters
     * @returns A paginated list of availability records
     */
    async findAll(filter) {
        return this.availabilityService.findAll(filter);
    }
    /**
     * Create a new employee availability record.
     *
     * @param entity The data for the new availability record
     * @returns The created availability record
     */
    async create(entity) {
        return this.commandBus.execute(new commands_1.EmployeeAvailabilityCreateCommand(entity));
    }
    /**
     * Update an existing employee availability record by its ID.
     *
     * @param id The ID of the availability record
     * @param entity The updated data for the record
     * @returns The updated availability record
     */
    async update(id, entity) {
        return this.availabilityService.update(id, { ...entity });
    }
};
exports.EmployeeAvailabilityController = EmployeeAvailabilityController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple availability records' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The records have been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_CREATE),
    (0, common_1.Post)('/bulk'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAvailabilityController.prototype, "createBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all availability records' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved availability records.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No availability records found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_READ),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAvailabilityController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new availability record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_CREATE),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_employee_availability_dto_1.CreateEmployeeAvailabilityDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAvailabilityController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing availability record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_UPDATE),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, update_employee_availability_dto_1.UpdateEmployeeAvailabilityDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAvailabilityController.prototype, "update", null);
exports.EmployeeAvailabilityController = EmployeeAvailabilityController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeAvailability'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_UPDATE, contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_DELETE),
    (0, common_1.Controller)('/employee-availability'),
    tslib_1.__metadata("design:paramtypes", [employee_availability_service_1.EmployeeAvailabilityService,
        cqrs_1.CommandBus])
], EmployeeAvailabilityController);
//# sourceMappingURL=employee-availability.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../../shared/decorators");
const guards_1 = require("../../shared/guards");
const pipes_1 = require("./../../shared/pipes");
const commands_1 = require("./commands");
const time_slot_entity_1 = require("./time-slot.entity");
const time_slot_service_1 = require("./time-slot.service");
const dto_1 = require("./dto");
let TimeSlotController = class TimeSlotController {
    constructor(_timeSlotService, _commandBus) {
        this._timeSlotService = _timeSlotService;
        this._commandBus = _commandBus;
    }
    /**
     * Retrieves all time slots based on the provided query options.
     *
     * This method accepts query parameters to filter the list of time slots
     * and uses the `TimeSlotQueryDTO` for validation and transformation.
     * The method calls the `timeSlotService` to fetch the matching time slots.
     *
     * @param options - Query parameters for filtering the time slots.
     * @returns A promise that resolves to an array of time slots matching the specified criteria.
     */
    async findAll(options) {
        return await this._timeSlotService.getTimeSlots(options);
    }
    /**
     * Retrieves a specific time slot by its ID.
     *
     * This method accepts a time slot ID as a parameter and query options for
     * additional filtering or selecting specific fields. It uses `UUIDValidationPipe`
     * to ensure that the provided ID is a valid UUID. The method calls the
     * `timeSlotService` to find the time slot by its ID.
     *
     * @param id - The UUID of the time slot to retrieve.
     * @param options - Additional query options to refine the search (e.g., relations).
     * @returns A promise that resolves to the time slot object if found.
     */
    async findById(id, options) {
        return await this._timeSlotService.findOneByIdString(id, options);
    }
    /**
     * Handles the creation of a new time slot based on the provided request data.
     * This method is called via an HTTP POST request and invokes the `CreateTimeSlotCommand`
     * to execute the time slot creation logic.
     *
     * @param {ITimeSlot} request - The time slot data provided in the request body.
     * @returns {Promise<ITimeSlot>} - A promise that resolves to the created TimeSlot instance.
     */
    async create(request) {
        return await this._commandBus.execute(new commands_1.CreateTimeSlotCommand(request));
    }
    /**
     * Updates a specific time slot by its ID.
     *
     * This method allows modifying the details of a time slot using its unique ID.
     * It accepts a time slot ID as a parameter and the updated time slot data as the
     * request body. The method is guarded by `OrganizationPermissionGuard` to ensure
     * only authorized users with the `ALLOW_MODIFY_TIME` permission can perform updates.
     *
     * @param id - The UUID of the time slot to update.
     * @param request - The updated time slot data to apply.
     * @returns A promise that resolves to the updated time slot.
     */
    async update(id, request) {
        return await this._commandBus.execute(new commands_1.UpdateTimeSlotCommand(id, request));
    }
    /**
     * Deletes time slots based on the provided query parameters.
     *
     * This method allows deleting multiple time slots by accepting a list of time slot IDs
     * in the query parameters. The method is protected by `OrganizationPermissionGuard`
     * to ensure that only authorized users with the `ALLOW_DELETE_TIME` permission can delete time slots.
     *
     * @param query - The DTO containing the IDs of the time slots to delete.
     * @returns A promise that resolves to either a `DeleteResult` or `UpdateResult` indicating the outcome of the deletion process.
     */
    async deleteTimeSlot(options) {
        return await this._commandBus.execute(new commands_1.DeleteTimeSlotCommand(options));
    }
};
exports.TimeSlotController = TimeSlotController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Time Slots' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TimeSlotQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSlotController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Time Slot By Id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSlotController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Time Slot' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSlotController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Time Slot' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.OrganizationPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALLOW_MODIFY_TIME),
    (0, decorators_1.OrganizationPolicyTarget)(time_slot_entity_1.TimeSlot),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSlotController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete TimeSlot' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The time slot has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.OrganizationPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALLOW_DELETE_TIME),
    (0, common_1.Delete)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.DeleteTimeSlotDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeSlotController.prototype, "deleteTimeSlot", null);
exports.TimeSlotController = TimeSlotController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimeSlot'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER, contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Controller)('/timesheet/time-slot'),
    tslib_1.__metadata("design:paramtypes", [time_slot_service_1.TimeSlotService, cqrs_1.CommandBus])
], TimeSlotController);
//# sourceMappingURL=time-slot.controller.js.map
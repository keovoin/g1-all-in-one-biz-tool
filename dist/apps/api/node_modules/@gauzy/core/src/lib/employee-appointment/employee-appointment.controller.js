"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAppointmentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_i18n_1 = require("nestjs-i18n");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const dto_1 = require("../shared/dto");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const employee_appointment_service_1 = require("./employee-appointment.service");
const commands_1 = require("./commands");
const employee_appointment_entity_1 = require("./employee-appointment.entity");
let EmployeeAppointmentController = class EmployeeAppointmentController extends crud_1.CrudController {
    constructor(employeeAppointmentService, commandBus) {
        super(employeeAppointmentService);
        this.employeeAppointmentService = employeeAppointmentService;
        this.commandBus = commandBus;
    }
    /**
     * GET sign appointment
     *
     * @param id
     * @returns
     */
    async signAppointment(id) {
        return this.employeeAppointmentService.signAppointmentId(id);
    }
    /**
     * GET verify token
     *
     * @param token
     * @returns
     */
    async decodeToken(token) {
        const decoded = this.employeeAppointmentService.decodeSignToken(token);
        return decoded['appointmentId'];
    }
    /**
     * GET employee appointment by pagination
     *
     * @param filter
     * @returns
     */
    async pagination(filter) {
        return this.employeeAppointmentService.paginate(filter);
    }
    /**
     * GET all employee appointments
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return this.employeeAppointmentService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * GET employee appointment by id
     *
     * @param id
     * @returns
     */
    async findById(id, query) {
        return await this.employeeAppointmentService.findById(id, query.relations);
    }
    /**
     * CREATE employee create
     *
     * @param entity
     * @param languageCode
     * @returns
     */
    async create(entity, languageCode) {
        return await this.commandBus.execute(new commands_1.EmployeeAppointmentCreateCommand(entity, languageCode));
    }
    /**
     * UPDATE employee appointment
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.EmployeeAppointmentUpdateCommand(id, entity));
    }
};
exports.EmployeeAppointmentController = EmployeeAppointmentController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sign appointment id payload' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Token generated',
        type: String
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.EXPECTATION_FAILED,
        description: 'Token generation failure'
    }),
    (0, common_1.Get)('/sign/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "signAppointment", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify token' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Token verified',
        type: String
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.EXPECTATION_FAILED,
        description: 'Token verification failure'
    }),
    (0, common_1.Get)('/decode/:token'),
    tslib_1.__param(0, (0, common_1.Param)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "decodeToken", null);
tslib_1.__decorate([
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all employee appointments'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee appointments',
        type: employee_appointment_entity_1.EmployeeAppointment
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Employee appointment by id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record',
        type: employee_appointment_entity_1.EmployeeAppointment
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RelationsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAppointmentController.prototype, "update", null);
exports.EmployeeAppointmentController = EmployeeAppointmentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeAppointment'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/employee-appointment'),
    tslib_1.__metadata("design:paramtypes", [employee_appointment_service_1.EmployeeAppointmentService,
        cqrs_1.CommandBus])
], EmployeeAppointmentController);
//# sourceMappingURL=employee-appointment.controller.js.map
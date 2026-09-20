"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const nestjs_i18n_1 = require("nestjs-i18n");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const dto_1 = require("./../core/dto");
const decorators_1 = require("./../shared/decorators");
const dto_2 = require("./../shared/dto");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const commands_1 = require("./commands");
const employee_entity_1 = require("./employee.entity");
const employee_service_1 = require("./employee.service");
const dto_3 = require("./dto");
const sensitive_relations_decorator_1 = require("../core/decorators/sensitive-relations.decorator");
const sensitive_relations_interceptor_1 = require("../core/interceptors/sensitive-relations.interceptor");
const organization_sensitive_relations_config_1 = require("../core/util/organization-sensitive-relations.config");
let EmployeeController = class EmployeeController extends crud_1.CrudController {
    constructor(_employeeService, _commandBus) {
        super(_employeeService);
        this._employeeService = _employeeService;
        this._commandBus = _commandBus;
    }
    /**
     * Retrieve all working employees based on specified query data.
     *
     * This endpoint fetches all working employees using a command pattern. The query parameter 'data'
     * is parsed using a custom `ParseJsonPipe`, allowing clients to provide structured input.
     *
     * @param data - The JSON-formatted query data, parsed by `ParseJsonPipe`.
     * @returns A promise resolving to a paginated list of working employees.
     */
    async findAllWorkingEmployees(data) {
        const { findInput } = data;
        return await this._commandBus.execute(new commands_1.WorkingEmployeeGetCommand(findInput));
    }
    /**
     * Retrieve the count of all working employees.
     *
     * This endpoint returns the total count of working employees, based on the given query data.
     * The 'data' parameter is parsed with `ParseJsonPipe` to ensure correct structure.
     *
     * @param data - The JSON-formatted query data parsed by `ParseJsonPipe`.
     * @returns A promise resolving to an object with the total count of working employees.
     * @throws NotFoundException if no data is provided or if the count operation fails.
     */
    async findAllWorkingEmployeesCount(data) {
        const { findInput } = data;
        const { organizationId, forRange } = findInput;
        return await this._employeeService.findWorkingEmployeesCount(organizationId, forRange);
    }
    /**
     * CREATE bulk employees in the same tenant.
     *
     * This endpoint allows for the bulk creation of employees within the same tenant.
     * It accepts an array of employee data and processes it in a single request.
     *
     * @param entity The DTO containing the list of employees to create.
     * @param themeLanguage The theme language for additional context.
     * @param languageCode The language code for localization.
     * @param origin The origin of the request for reference.
     * @returns A promise resolving to an array of the created employees.
     */
    async createBulk(entity, themeLanguage, languageCode, origin) {
        // Execute a command to create multiple employees in bulk
        return await this._commandBus.execute(new commands_1.EmployeeBulkCreateCommand(entity.list, themeLanguage || languageCode, origin));
    }
    /**
     * GET employee count in the same tenant.
     *
     * This endpoint retrieves the count of employees within a specific tenant.
     * It takes query parameters to filter the employee count by certain criteria.
     *
     * @param options Query parameters to filter the employee count.
     * @returns A promise resolving to the total count of employees in the tenant.
     */
    async getCount(options) {
        return await this._employeeService.countBy(options);
    }
    /**
     * GET employees by pagination in the same tenant.
     *
     * This endpoint retrieves employees by pagination within a specific tenant.
     * It uses query parameters to manage pagination and filtering options.
     *
     * @param params Pagination and filtering parameters.
     * @returns A promise resolving to a paginated list of employees.
     */
    async pagination(params) {
        return await this._employeeService.pagination(params);
    }
    /**
     * GET members of the organization
     *
     * This endpoint retrieves a list of members of the organization based on the provided query parameters.
     * It allows filtering by organization team ID, organization project ID, and other criteria.
     *
     * @param options - Query parameters for filtering members.
     * @returns A promise resolving to a list of members.
     */
    async getMembers(options) {
        return await this._employeeService.findMembers(options);
    }
    /**
     * GET all employees in the same tenant.
     *
     * This endpoint retrieves all employees within a specific tenant with pagination and filtering options.
     * It applies additional constraints to ensure only active, non-archived employees are retrieved.
     *
     * @param options Pagination and filtering parameters.
     * @returns A promise resolving to a paginated list of employees.
     */
    async findAll(options) {
        // Enforce that only active, non-archived users are retrieved
        const where = {
            ...(options.where || {}),
            user: { isActive: true, isArchived: false }
        };
        return await this._employeeService.findAll({ ...options, where });
    }
    /**
     * GET employee by ID within the same tenant.
     *
     * This endpoint retrieves an employee by their ID, allowing additional filtering based on permissions.
     *
     * @param id The unique identifier of the employee to find.
     * @param params Additional query parameters to customize the search, like related entities.
     * @returns A promise resolving to the employee record if found.
     */
    async findById(id, params) {
        // Check permissions to determine the correct ID to retrieve. A caller without
        // CHANGE_SELECTED_EMPLOYEE may only read their OWN employee record; a caller with no employee
        // record has nothing to read (an empty id used to be dropped from the where and returned the
        // first employee of the tenant).
        const ownEmployeeId = context_1.RequestContext.currentEmployeeId();
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE) && !ownEmployeeId) {
            throw new common_1.ForbiddenException('You do not have permission to view this employee.');
        }
        const searchCriteria = {
            where: {
                ...(context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE) ? { id } : { id: ownEmployeeId })
            },
            ...(params.relations ? { relations: params.relations } : {}),
            withDeleted: true
        };
        return await this._commandBus.execute(new commands_1.EmployeeGetCommand(searchCriteria));
    }
    /**
     * CREATE a new employee in the same tenant.
     *
     * This endpoint creates a new employee, handling necessary validations and internationalization.
     *
     * @param entity The details of the new employee to be created.
     * @param origin The origin header, used to determine the request source.
     * @param languageCode The language code for localization and internationalization.
     * @returns A promise resolving to the newly created employee record.
     */
    async create(entity, origin, languageCode) {
        return await this._commandBus.execute(new commands_1.EmployeeCreateCommand(entity, languageCode, origin));
    }
    /**
     * UPDATE an existing employee by ID in the same tenant.
     *
     * This endpoint updates an existing employee record based on the provided ID and update data.
     *
     * @param id The unique identifier of the employee to update.
     * @param entity The data to update for the employee.
     * @returns A promise resolving to the updated employee record.
     */
    async update(id, entity) {
        return await this._commandBus.execute(new commands_1.EmployeeUpdateCommand(id, entity));
    }
    /**
     * Update employee's own profile by themselves
     *
     * This endpoint allows an employee to update their own profile.
     *
     * @param id The unique identifier of the employee.
     * @param entity The data to update for the employee's profile.
     * @returns A promise resolving to the updated employee record.
     */
    async updateProfile(id, entity) {
        return await this._commandBus.execute(new commands_1.EmployeeUpdateCommand(id, entity));
    }
    /**
     * Soft delete employee from organization
     *
     * @param employeeId
     * @returns
     */
    async delete(id, options) {
        return await this._employeeService.delete(id, { where: { ...options } });
    }
    /**
     * Soft deletes an employee from the organization by ID.
     *
     * This endpoint allows soft-deletion of an employee record by providing its UUID.
     *
     * @param employeeId - The UUID of the employee to be soft-deleted.
     * @param params - Parameters required for tenant/organization identification.
     * @returns A promise resolving to the soft-deleted employee entity.
     */
    async softRemove(id, params) {
        // Soft remove the employee by ID
        return await this._employeeService.softRemovedById(id, params);
    }
    /**
     * Restores a soft-deleted employee by ID.
     *
     * This endpoint allows the restoration of a soft-deleted employee record by providing its UUID.
     *
     * @param employeeId - The UUID of the employee to be restored.
     * @param params - Parameters for tenant/organization identification.
     * @returns A promise resolving to the restored employee entity.
     */
    async softRecover(id, params) {
        // Attempt to recover the soft-removed employee
        return await this._employeeService.softRecoverById(id, params);
    }
};
exports.EmployeeController = EmployeeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all working employees.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found working employees',
        type: employee_entity_1.Employee
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No working employees found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE, contracts_1.PermissionsEnum.SELECT_EMPLOYEE),
    (0, common_1.Get)('/working'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAllWorkingEmployees", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the total count of all working employees.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found the total count of working employees'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Working employees count not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE, contracts_1.PermissionsEnum.SELECT_EMPLOYEE),
    (0, common_1.Get)('/working/count'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAllWorkingEmployeesCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple employee records in bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Records have been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues about what went wrong.'
    }),
    (0, common_1.Post)('/bulk'),
    tslib_1.__param(0, (0, common_1.Body)(pipes_1.BulkBodyLoadTransformPipe, new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__param(3, (0, common_1.Headers)('origin')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.EmployeeBulkInputDTO, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "createBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get employee count in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the employee count.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving the employee count.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EMPLOYEES_VIEW),
    (0, common_1.Get)('/count'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.CountQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get employees by pagination in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved paginated employees.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving paginated employees.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EMPLOYEES_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get members of the organization' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Members of the organization'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No members found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_MEMBERS_VIEW),
    (0, common_1.Get)('/members'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.FindMembersInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "getMembers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all employees in the same tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully found employees in the tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No employees found for the given criteria.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EMPLOYEES_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find employee by ID within the same tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Employee record found.',
        type: employee_entity_1.Employee
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Employee record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check your query parameters.'
    }),
    (0, decorators_1.Permissions)(),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new employee in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Employee record created successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check the request body for potential issues.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('origin')),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.CreateEmployeeDTO, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing employee by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The employee record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check the request body for errors.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_3.UpdateEmployeeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Employee Own Profile' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Profile has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check the response body for more details.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.PROFILE_EDIT),
    (0, common_1.Put)('/:id/profile'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_3.UpdateProfileDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "updateProfile", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete employee record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully soft-deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Employee record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id/soft'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "softRemove", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted employee record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully restored'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Employee record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id/recover'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeController.prototype, "softRecover", null);
exports.EmployeeController = EmployeeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Employee'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EMPLOYEES_EDIT),
    (0, common_1.UseInterceptors)(sensitive_relations_interceptor_1.SensitiveRelationsInterceptor),
    (0, sensitive_relations_decorator_1.SensitiveRelations)(organization_sensitive_relations_config_1.ORGANIZATION_SENSITIVE_RELATIONS, 'organization'),
    (0, common_1.Controller)('/employee'),
    tslib_1.__metadata("design:paramtypes", [employee_service_1.EmployeeService, cqrs_1.CommandBus])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map
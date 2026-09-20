"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../../../core/context");
const auth_service_1 = require("../../../auth/auth.service");
const user_organization_services_1 = require("../../../user-organization/user-organization.services");
const employee_service_1 = require("../../employee.service");
const employee_create_command_1 = require("../employee.create.command");
const email_service_1 = require("./../../../email-send/email.service");
const commands_1 = require("./../../../user/commands");
const role_service_1 = require("./../../../role/role.service");
const user_service_1 = require("./../../../user/user.service");
let EmployeeCreateHandler = class EmployeeCreateHandler {
    constructor(_commandBus, _employeeService, _userOrganizationService, _authService, _emailService, _roleService, _userService) {
        this._commandBus = _commandBus;
        this._employeeService = _employeeService;
        this._userOrganizationService = _userOrganizationService;
        this._authService = _authService;
        this._emailService = _emailService;
        this._roleService = _roleService;
        this._userService = _userService;
    }
    /**
     * Execute the employee creation command.
     *
     * @param command - The employee creation command.
     * @returns The created employee.
     * @throws SomeAppropriateException if an error occurs during the process.
     */
    async execute(command) {
        const { input, originUrl = config_1.environment.clientBaseUrl } = command;
        const languageCode = command.languageCode || contracts_1.LanguagesEnum.ENGLISH;
        const { organizationId } = input;
        if ((0, utils_1.isEmpty)(input.userId)) {
            const tenantId = context_1.RequestContext.currentTenantId();
            let existingUser = null;
            if (!input.user?.email) {
                throw new common_1.BadRequestException('User email is required when userId is not provided');
            }
            try {
                // Check if a user with this email already exists in the current tenant
                // Include role relation for addUserToOrganization which checks user.role.name
                existingUser = await this._userService.findOneByOptions({
                    where: { email: input.user.email, tenantId },
                    relations: { role: true }
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
                // User not found - existingUser remains null and we'll create a new user
            }
            if (existingUser) {
                // Check if an employee already exists for this user in this organization
                try {
                    const existingEmployee = await this._employeeService.findOneByWhereOptions({
                        userId: existingUser.id,
                        organizationId
                    });
                    if (existingEmployee) {
                        throw new common_1.BadRequestException('Employee already exists for this user in this organization');
                    }
                }
                catch (error) {
                    if (!(error instanceof common_1.NotFoundException)) {
                        throw error;
                    }
                    // No existing employee found - proceed with creation
                }
                // Determine if user has administrative privileges
                const isUserAdmin = [contracts_1.RolesEnum.ADMIN, contracts_1.RolesEnum.SUPER_ADMIN].includes(existingUser.role?.name);
                // User already exists in this tenant - create only the employee
                const employee = await this._employeeService.create({
                    ...input,
                    user: existingUser,
                    organizationId,
                    organization: { id: organizationId },
                    allowManualTime: isUserAdmin,
                    allowModifyTime: isUserAdmin,
                    allowDeleteTime: isUserAdmin
                });
                // Assign organization to the existing user
                if (!!employee.organizationId) {
                    await this._userOrganizationService.addUserToOrganization(existingUser, organizationId);
                }
                return employee;
            }
            // User doesn't exist in this tenant - create new user and employee
            // 1. Find employee role for relative tenant
            const role = await this._roleService.findOneByWhereOptions({
                name: contracts_1.RolesEnum.EMPLOYEE,
                tenantId: context_1.RequestContext.currentTenantId()
            });
            // 2. Get Password Hash
            const passwordHash = await this._authService.getPasswordHash(input.password);
            // 3. Create user to relative tenant.
            const user = await this._commandBus.execute(new commands_1.UserCreateCommand({
                ...input.user,
                role,
                hash: passwordHash,
                preferredLanguage: languageCode,
                preferredComponentLayout: contracts_1.ComponentLayoutStyleEnum.TABLE
            }));
            // 4. Create employee for specific user
            const employee = await this._employeeService.create({
                ...input,
                user,
                organizationId,
                organization: { id: organizationId }
            });
            // 5. Assign organizations to the employee user
            if (!!employee.organizationId) {
                await this._userOrganizationService.addUserToOrganization(user, organizationId);
            }
            // 6. Send welcome email to user register employee
            this._emailService.welcomeUser(user, languageCode, organizationId, originUrl);
            return employee;
        }
        else {
            try {
                const user = await this._userService.findOneByIdString(input.userId, {
                    relations: { role: true }
                });
                // Determine if user has administrative privileges
                const isUserAdmin = [contracts_1.RolesEnum.ADMIN, contracts_1.RolesEnum.SUPER_ADMIN].includes(user.role?.name);
                //1. Create employee for specific user
                return await this._employeeService.create({
                    ...input,
                    user,
                    organizationId,
                    organization: { id: organizationId },
                    allowManualTime: isUserAdmin,
                    allowModifyTime: isUserAdmin,
                    allowDeleteTime: isUserAdmin
                });
            }
            catch (error) {
                console.log('Error while creating employee for existing user', error);
            }
        }
    }
};
exports.EmployeeCreateHandler = EmployeeCreateHandler;
exports.EmployeeCreateHandler = EmployeeCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_create_command_1.EmployeeCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        employee_service_1.EmployeeService,
        user_organization_services_1.UserOrganizationService,
        auth_service_1.AuthService,
        email_service_1.EmailService,
        role_service_1.RoleService,
        user_service_1.UserService])
], EmployeeCreateHandler);
//# sourceMappingURL=employee.create.handler.js.map
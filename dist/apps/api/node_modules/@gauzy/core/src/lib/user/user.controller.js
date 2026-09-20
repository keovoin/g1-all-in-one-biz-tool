"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
const commands_1 = require("./commands");
const factory_reset_service_1 = require("./factory-reset/factory-reset.service");
const dto_1 = require("./dto");
/** Allowlist of safe relations to prevent unauthorized data access */
const ALLOWED_RELATIONS = ['role', 'tenant', 'employee', 'candidate', 'tags'];
let UserController = class UserController extends crud_1.CrudController {
    constructor(_userService, _factoryResetService, _commandBus) {
        super(_userService);
        this._userService = _userService;
        this._factoryResetService = _factoryResetService;
        this._commandBus = _commandBus;
    }
    /**
     * GET endpoint to retrieve details of the currently logged-in user.
     *
     * @param options Query parameters specifying what additional relations to load for the user.
     * @returns A Promise that resolves to the IUser object.
     */
    async findMe(options) {
        return await this._userService.findMeUser(options);
    }
    /**
     * GET user by email
     *
     * @param email
     * @returns
     */
    async findByEmail(email) {
        // Scope the lookup to the CALLER'S tenant. ORG_USERS_VIEW authorizes reading the users of
        // your own tenant, not of every tenant on the installation — the unscoped lookup that used
        // to sit here answered for any address in the database and leaked a foreign tenant's user
        // profile (id, tenantId, names, phone, username, avatar, last login) to anyone who could
        // guess an email address.
        //
        // The contract is deliberately unchanged: a miss still resolves to `null` with a 200, which
        // is what the invite-contact form's async validator in the Angular UI checks for. Within the
        // tenant the endpoint behaves exactly as before.
        return await this._userService.getUserByEmailInTenant(email, context_1.RequestContext.currentTenantId());
    }
    /**
     * UPDATE user preferred language
     *
     * @param entity
     * @returns
     */
    async updatePreferredLanguage(entity) {
        return await this._userService.updatePreferredLanguage(entity.preferredLanguage);
    }
    /**
     * UPDATE user preferred component layout
     *
     * @param entity
     * @returns
     */
    async updatePreferredComponentLayout(entity) {
        return await this._userService.updatePreferredComponentLayout(entity.preferredComponentLayout);
    }
    /**
     * UPDATE the current user's per-feature UI preferences (shallow merge per feature key).
     *
     * Deliberately NOT `whitelist: true`: the body is keyed by feature (`aiChat`, ...) and future
     * features add their own keys without a DTO change; unknown keys are validated structurally
     * by the service (plain object or null, size-capped, no prototype keys).
     *
     * @param entity - Feature-keyed patch.
     * @returns The merged preferences as stored.
     */
    async updateUiPreferences(entity) {
        return await this._userService.updateUiPreferences(entity);
    }
    /**
     * GET user count for specific tenant
     *
     * @returns
     */
    async getCount(options) {
        return await this._userService.countBy(options);
    }
    /**
     * GET users for specific tenant using pagination
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        return await this._userService.paginate(options);
    }
    /**
     * GET users for specific tenant
     *
     * @param options
     * @returns
     */
    async findAll(options) {
        return await this._userService.findAll(options);
    }
    /**
     * GET user by id
     *
     * @param id
     * @param data
     * @returns
     */
    async findById(id, data) {
        const rawRelations = data?.relations;
        let relations;
        if (Array.isArray(rawRelations)) {
            // Filter array entries to only allowed relation names
            relations = rawRelations.filter((r) => typeof r === 'string' && ALLOWED_RELATIONS.includes(r));
        }
        else if (typeof rawRelations === 'object' && rawRelations !== null) {
            // Keep only allowed top-level keys and coerce values to true (strip nested objects)
            relations = Object.fromEntries(Object.entries(rawRelations)
                .filter(([key, val]) => ALLOWED_RELATIONS.includes(key) && typeof val !== 'object')
                .map(([key]) => [key, true]));
        }
        else {
            relations = {};
        }
        return await this._userService.findOneByIdString(id, { relations });
    }
    /**
     * CREATE user for specific tenant
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this._commandBus.execute(new commands_1.UserCreateCommand(entity));
    }
    /**
     * UPDATE user by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this._userService.updateProfile(id, { ...entity, id });
    }
    /**
     * To permanently delete your account from your Gauzy app:
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await this._commandBus.execute(new commands_1.UserDeleteCommand(id));
    }
    /**
     * DELETE all user data from all tables
     *
     * @returns
     */
    async factoryReset() {
        return await this._factoryResetService.reset();
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find current user.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found current user', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.Get)('/me'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.FindMeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findMe", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find user by email address.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found user by email address',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_VIEW),
    (0, common_1.Get)('/email/:email'),
    tslib_1.__param(0, (0, common_1.Param)('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findByEmail", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Put)('/preferred-language'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UpdatePreferredLanguageDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updatePreferredLanguage", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Put)('/preferred-layout'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UpdatePreferredComponentLayoutDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updatePreferredComponentLayout", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update the current user's UI preferences (per-feature shallow merge)." }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'Merged UI preferences' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid patch' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Put)('/ui-preferences'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UpdateUserUiPreferencesDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateUiPreferences", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_VIEW),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_VIEW),
    (0, common_1.Get)('/pagination'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all users.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found users',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find User by id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateUserDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT, contracts_1.PermissionsEnum.PROFILE_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateUserDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete all user data.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Deleted all user data.',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ACCESS_DELETE_ALL_DATA),
    (0, common_1.Delete)('/reset'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "factoryReset", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('/user'),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService,
        factory_reset_service_1.FactoryResetService,
        cqrs_1.CommandBus])
], UserController);
//# sourceMappingURL=user.controller.js.map
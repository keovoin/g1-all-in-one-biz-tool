"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_2 = require("@gauzy/common");
const changelog_entity_1 = require("./changelog.entity");
const changelog_service_1 = require("./changelog.service");
const commands_1 = require("./commands");
const changelog_query_dto_1 = require("./dto/changelog-query.dto");
/**
 * Changelog is PLATFORM-level content: the public GET feeds the "What's New"
 * sidebar plus the login/register pages, and every write is a broadcast to all
 * of them. Writes are therefore SUPER_ADMIN-only — before this guard any
 * authenticated user could rewrite what every visitor sees on the login page.
 */
let ChangelogController = class ChangelogController extends core_1.CrudController {
    constructor(changelogService, commandBus) {
        super(changelogService);
        this.changelogService = changelogService;
        this.commandBus = commandBus;
    }
    /**
     * Public list of changelog entries, newest first (see the service for the
     * ordering/cap). `whitelist` matters here: the DTO'd query goes straight
     * into a TypeORM `where`, so unknown params must be stripped, not passed.
     *
     * @param options
     * @returns
     */
    async findChangelog(options) {
        return await this.changelogService.findAllChangelogs(options);
    }
    /**
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.ChangelogCreateCommand(entity));
    }
    /**
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ChangelogUpdateCommand({ ...entity, id }));
    }
    /**
     * Overrides the inherited CRUD delete purely to attach the SUPER_ADMIN
     * guard — the base route ships with class-level AuthGuard only.
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await this.changelogService.delete(id);
    }
    /**
     * Same guard-only override for the inherited soft-delete route.
     */
    async softRemove(id) {
        return await this.changelogService.softRemove(id);
    }
    /**
     * Same guard-only override for the inherited soft-recover route.
     */
    async softRecover(id) {
        return await this.changelogService.softRecover(id);
    }
};
exports.ChangelogController = ChangelogController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all Changelog.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records',
        type: changelog_entity_1.Changelog
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No records found'
    }),
    (0, common_2.Public)(),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [changelog_query_dto_1.ChangelogQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ChangelogController.prototype, "findChangelog", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.RoleGuard),
    (0, core_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ChangelogController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.RoleGuard),
    (0, core_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ChangelogController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Record has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.RoleGuard),
    (0, core_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ChangelogController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a record by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'Record soft deleted successfully'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.RoleGuard),
    (0, core_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Delete)('/:id/soft'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ChangelogController.prototype, "softRemove", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted record by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'Record restored successfully'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.RoleGuard),
    (0, core_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Put)('/:id/recover'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ChangelogController.prototype, "softRecover", null);
exports.ChangelogController = ChangelogController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Changelog'),
    (0, common_1.UseGuards)(core_1.AuthGuard),
    (0, common_1.Controller)('/changelog'),
    tslib_1.__metadata("design:paramtypes", [changelog_service_1.ChangelogService, cqrs_1.CommandBus])
], ChangelogController);
//# sourceMappingURL=changelog.controller.js.map
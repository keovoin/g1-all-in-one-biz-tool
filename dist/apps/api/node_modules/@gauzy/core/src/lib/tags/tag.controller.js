"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const tag_service_1 = require("./tag.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let TagController = class TagController extends crud_1.CrudController {
    constructor(tagService, commandBus) {
        super(tagService);
        this.tagService = tagService;
        this.commandBus = commandBus;
    }
    /**
     * Get tags by level
     *
     * @param query
     */
    async findTagsByLevel(query) {
        try {
            console.log('TagController -> findTagsByLevel -> query', query);
            return await this.tagService.findTagsByLevel(query, query.relations);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Get tags
     *
     * @param data
     * @returns
     */
    async findAll(options) {
        return await this.commandBus.execute(new commands_1.TagListCommand(options.where, options.relations));
    }
    /**
     * Create new tag
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.tagService.create(entity);
    }
    /**
     * Update existing tag by ID
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.tagService.update(id, entity);
    }
};
exports.TagController = TagController;
tslib_1.__decorate([
    (0, common_1.Get)('/level'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TagQueryByLevelDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagController.prototype, "findTagsByLevel", null);
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TAGS_ADD),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTagDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TAGS_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateTagDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagController.prototype, "update", null);
exports.TagController = TagController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Tags'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/tags'),
    tslib_1.__metadata("design:paramtypes", [tag_service_1.TagService, cqrs_1.CommandBus])
], TagController);
//# sourceMappingURL=tag.controller.js.map
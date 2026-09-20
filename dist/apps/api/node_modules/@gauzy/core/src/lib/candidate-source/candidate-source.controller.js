"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSourceController = void 0;
const tslib_1 = require("tslib");
const candidate_source_entity_1 = require("./candidate-source.entity");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const candidate_source_service_1 = require("./candidate-source.service");
const dto_1 = require("./dto");
let CandidateSourceController = class CandidateSourceController extends crud_1.CrudController {
    constructor(candidateSourceService) {
        super(candidateSourceService);
        this.candidateSourceService = candidateSourceService;
    }
    /**
     * GET candidate sources by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this.candidateSourceService.paginate(params);
    }
    /**
     * GET candidate sources
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.candidateSourceService.findAll({
            where: params.where
        });
    }
    /**
     * CREATE candidate source
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.candidateSourceService.create(entity);
    }
    /**
     * UPDATE candidate source
     *
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.candidateSourceService.update(id, entity);
    }
};
exports.CandidateSourceController = CandidateSourceController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSourceController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate source.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate source',
        type: candidate_source_entity_1.CandidateSource
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSourceController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create candidate source.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Created candidate source',
        type: candidate_source_entity_1.CandidateSource
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateCandidateSourceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSourceController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateCandidateSourceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSourceController.prototype, "update", null);
exports.CandidateSourceController = CandidateSourceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateSource'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT),
    (0, common_1.Controller)('/candidate-source'),
    tslib_1.__metadata("design:paramtypes", [candidate_source_service_1.CandidateSourceService])
], CandidateSourceController);
//# sourceMappingURL=candidate-source.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateEducationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_education_service_1 = require("./candidate-education.service");
const candidate_education_entity_1 = require("./candidate-education.entity");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let CandidateEducationController = class CandidateEducationController extends crud_1.CrudController {
    constructor(candidateEducationService) {
        super(candidateEducationService);
        this.candidateEducationService = candidateEducationService;
    }
    /**
     * GET candidate educations by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this.candidateEducationService.paginate(params);
    }
    /**
     * GET candidate educations
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.candidateEducationService.findAll({
            where: params.where
        });
    }
    /**
     * CREATE candidate education
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.candidateEducationService.create(entity);
    }
    /**
     * UPDATE candidate education
     *
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.candidateEducationService.update(id, entity);
    }
};
exports.CandidateEducationController = CandidateEducationController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateEducationController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate education.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate education',
        type: candidate_education_entity_1.CandidateEducation
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
], CandidateEducationController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateCandidateEducationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateEducationController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateCandidateEducationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateEducationController.prototype, "update", null);
exports.CandidateEducationController = CandidateEducationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateEducation'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT),
    (0, common_1.Controller)('/candidate-educations'),
    tslib_1.__metadata("design:paramtypes", [candidate_education_service_1.CandidateEducationService])
], CandidateEducationController);
//# sourceMappingURL=candidate-education.controller.js.map
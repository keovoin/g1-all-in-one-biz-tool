"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateExperienceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_experience_service_1 = require("./candidate-experience.service");
const candidate_experience_entity_1 = require("./candidate-experience.entity");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let CandidateExperienceController = class CandidateExperienceController extends crud_1.CrudController {
    constructor(candidateExperienceService) {
        super(candidateExperienceService);
        this.candidateExperienceService = candidateExperienceService;
    }
    /**
     * GET candidate experiences by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this.candidateExperienceService.paginate(params);
    }
    /**
     * GET candidate experiences
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.candidateExperienceService.findAll(params);
    }
    /**
     * CREATE candidate experience
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.candidateExperienceService.create(entity);
    }
    /**
     * UPDATE candidate experience
     *
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.candidateExperienceService.update(id, entity);
    }
};
exports.CandidateExperienceController = CandidateExperienceController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateExperienceController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate experience.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate experience',
        type: candidate_experience_entity_1.CandidateExperience
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
], CandidateExperienceController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateCandidateExperienceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateExperienceController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateCandidateExperienceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateExperienceController.prototype, "update", null);
exports.CandidateExperienceController = CandidateExperienceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateExperience'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.TenantPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT),
    (0, common_1.Controller)('/candidate-experience'),
    tslib_1.__metadata("design:paramtypes", [candidate_experience_service_1.CandidateExperienceService])
], CandidateExperienceController);
//# sourceMappingURL=candidate-experience.controller.js.map
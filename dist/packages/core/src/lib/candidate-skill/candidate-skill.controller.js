"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSkillController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_skill_entity_1 = require("./candidate-skill.entity");
const candidate_skill_service_1 = require("./candidate-skill.service");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let CandidateSkillController = class CandidateSkillController extends crud_1.CrudController {
    constructor(candidateSkillService) {
        super(candidateSkillService);
        this.candidateSkillService = candidateSkillService;
    }
    /**
     * GET candidate skills by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this.candidateSkillService.paginate(params);
    }
    /**
     * GET candidate skills
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.candidateSkillService.findAll({
            where: params.where
        });
    }
    /**
     * CREATE candidate skill
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.candidateSkillService.create(entity);
    }
    /**
     * UPDATE candidate skill
     *
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.candidateSkillService.update(id, entity);
    }
};
exports.CandidateSkillController = CandidateSkillController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSkillController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate skill.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate skill',
        type: candidate_skill_entity_1.CandidateSkill
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
], CandidateSkillController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateCandidateSkillDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSkillController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateCandidateSkillDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateSkillController.prototype, "update", null);
exports.CandidateSkillController = CandidateSkillController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateSkill'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT),
    (0, common_1.Controller)('/candidate-skills'),
    tslib_1.__metadata("design:paramtypes", [candidate_skill_service_1.CandidateSkillService])
], CandidateSkillController);
//# sourceMappingURL=candidate-skill.controller.js.map
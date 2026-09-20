"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePersonalQualitiesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const candidate_personal_qualities_entity_1 = require("./candidate-personal-qualities.entity");
const candidate_personal_qualities_service_1 = require("./candidate-personal-qualities.service");
const commands_1 = require("./commands");
let CandidatePersonalQualitiesController = class CandidatePersonalQualitiesController extends crud_1.CrudController {
    constructor(candidatePersonalQualitiesService, commandBus) {
        super(candidatePersonalQualitiesService);
        this.candidatePersonalQualitiesService = candidatePersonalQualitiesService;
        this.commandBus = commandBus;
    }
    /**
     * GET candidate personal qualities by interview id
     *
     * @param interviewId
     * @returns
     */
    async findByInterviewId(interviewId) {
        return this.candidatePersonalQualitiesService.getPersonalQualitiesByInterviewId(interviewId);
    }
    /**
     * DELETE bulk candidate personal qualities by id
     *
     * @param id
     * @param data
     * @returns
     */
    async deleteBulk(id, data) {
        const { personalQualities = null } = data;
        return this.commandBus.execute(new commands_1.CandidatePersonalQualitiesBulkDeleteCommand(id, personalQualities));
    }
    /**
     * CREATE bulk candidate personal qualities
     *
     * @param body
     * @returns
     */
    async createBulk(body) {
        const { interviewId = null, personalQualities = [] } = body;
        return this.commandBus.execute(new commands_1.CandidatePersonalQualitiesBulkCreateCommand(interviewId, personalQualities));
    }
    /**
     * GET all candidate personal qualities
     *
     * @param data
     * @returns
     */
    findAll(data) {
        const { findInput, relations } = data;
        return this.candidatePersonalQualitiesService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * CREATE candidate personal quality
     *
     * @param data
     * @returns
     */
    async create(data) {
        return this.candidatePersonalQualitiesService.create(data);
    }
    /**
     * DELETE candidate personal qualities by id
     *
     * @param id
     * @returns
     */
    delete(id) {
        return this.candidatePersonalQualitiesService.delete(id);
    }
};
exports.CandidatePersonalQualitiesController = CandidatePersonalQualitiesController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Get)('interview/:interviewId'),
    tslib_1.__param(0, (0, common_1.Param)('interviewId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidatePersonalQualitiesController.prototype, "findByInterviewId", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Delete)('bulk/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidatePersonalQualitiesController.prototype, "deleteBulk", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Post)('bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidatePersonalQualitiesController.prototype, "createBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all candidate personal qualities.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate personal qualities',
        type: candidate_personal_qualities_entity_1.CandidatePersonalQualities
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidatePersonalQualitiesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidatePersonalQualitiesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidatePersonalQualitiesController.prototype, "delete", null);
exports.CandidatePersonalQualitiesController = CandidatePersonalQualitiesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidatePersonalQuality'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/candidate-personal-qualities'),
    tslib_1.__metadata("design:paramtypes", [candidate_personal_qualities_service_1.CandidatePersonalQualitiesService,
        cqrs_1.CommandBus])
], CandidatePersonalQualitiesController);
//# sourceMappingURL=candidate-personal-qualities.controller.js.map
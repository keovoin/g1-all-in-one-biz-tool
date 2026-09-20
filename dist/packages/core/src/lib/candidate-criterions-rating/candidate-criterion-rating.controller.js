"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRatingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_criterion_rating_service_1 = require("./candidate-criterion-rating.service");
const candidate_criterion_rating_entity_1 = require("./candidate-criterion-rating.entity");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
let CandidateCriterionsRatingController = class CandidateCriterionsRatingController extends crud_1.CrudController {
    constructor(candidateCriterionsRatingService, commandBus) {
        super(candidateCriterionsRatingService);
        this.candidateCriterionsRatingService = candidateCriterionsRatingService;
        this.commandBus = commandBus;
    }
    /**
     * CREATE bulk candidate criterions rating
     *
     * @param body
     * @returns
     */
    async createBulk(body) {
        const { feedbackId = null, technologies = [], qualities = [] } = body;
        return await this.commandBus.execute(new commands_1.CandidateCriterionsRatingBulkCreateCommand(feedbackId, technologies, qualities));
    }
    /**
     * UPDATE bulk candidate criterions rating
     *
     * @param body
     * @returns
     */
    async updateBulk(body) {
        return await this.commandBus.execute(new commands_1.CandidateCriterionsRatingBulkUpdateCommand(body));
    }
    /**
     * GET candidate criterions rating
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.candidateCriterionsRatingService.findAll(params);
    }
    /**
     * DELETE candidate criterions rating by feedback id
     *
     * @param feedbackId
     * @returns
     */
    async deleteBulkByFeedbackId(feedbackId) {
        return await this.commandBus.execute(new commands_1.CandidateCriterionsRatingBulkDeleteCommand(feedbackId));
    }
};
exports.CandidateCriterionsRatingController = CandidateCriterionsRatingController;
tslib_1.__decorate([
    (0, common_1.Post)('bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateCriterionsRatingController.prototype, "createBulk", null);
tslib_1.__decorate([
    (0, common_1.Put)('bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateCriterionsRatingController.prototype, "updateBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate criterion rating.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate criterion rating',
        type: candidate_criterion_rating_entity_1.CandidateCriterionsRating
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateCriterionsRatingController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Delete)('feedback/:feedbackId'),
    tslib_1.__param(0, (0, common_1.Param)('feedbackId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateCriterionsRatingController.prototype, "deleteBulkByFeedbackId", null);
exports.CandidateCriterionsRatingController = CandidateCriterionsRatingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateCriterionRating'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT),
    (0, common_1.Controller)('/candidate-criterions-rating'),
    tslib_1.__metadata("design:paramtypes", [candidate_criterion_rating_service_1.CandidateCriterionsRatingService,
        cqrs_1.CommandBus])
], CandidateCriterionsRatingController);
//# sourceMappingURL=candidate-criterion-rating.controller.js.map
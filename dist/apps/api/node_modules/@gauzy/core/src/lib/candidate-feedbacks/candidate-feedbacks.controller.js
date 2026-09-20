"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFeedbacksController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_feedbacks_entity_1 = require("./candidate-feedbacks.entity");
const candidate_feedbacks_service_1 = require("./candidate-feedbacks.service");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
let CandidateFeedbacksController = class CandidateFeedbacksController extends crud_1.CrudController {
    constructor(candidateFeedbacksService, commandBus) {
        super(candidateFeedbacksService);
        this.candidateFeedbacksService = candidateFeedbacksService;
        this.commandBus = commandBus;
    }
    /**
     * GET feedback by interview id
     *
     * @param interviewId
     * @returns
     */
    async findByInterviewId(interviewId) {
        return this.candidateFeedbacksService.getFeedbacksByInterviewId(interviewId);
    }
    /**
     * DELETE feedback by interview id
     *
     * @param interviewId
     * @param feedbackId
     * @returns
     */
    async deleteFeedback(interviewId, feedbackId) {
        return await this.commandBus.execute(new commands_1.FeedbackDeleteCommand(feedbackId, interviewId));
    }
    /**
     * GET candidate feedback count
     *
     * @param filter
     * @returns
     */
    async getCount(options) {
        return await this.candidateFeedbacksService.countBy(options);
    }
    /**
     * GET candidate feedbacks by pagination
     *
     * @param filter
     * @returns
     */
    async pagination(filter) {
        return this.candidateFeedbacksService.paginate(filter);
    }
    /**
     * GET all candidate feedbacks
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations = [], findInput = null } = data;
        return this.candidateFeedbacksService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * GET candidate feedback by id
     *
     * @param id
     * @returns
     */
    async findById(id) {
        return this.candidateFeedbacksService.findOneByIdString(id);
    }
    /**
     * CREATE candidate feedback
     *
     * @param body
     * @returns
     */
    async create(body) {
        return this.candidateFeedbacksService.create(body);
    }
    /**
     * UPDATE candidate feedback by id
     *
     * @param id
     * @param body
     * @returns
     */
    async update(id, body) {
        return this.commandBus.execute(new commands_1.FeedbackUpdateCommand(id, body));
    }
};
exports.CandidateFeedbacksController = CandidateFeedbacksController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find feedbacks By Interview Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate feedbacks',
        type: candidate_feedbacks_entity_1.CandidateFeedback
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard)
    // TO DO
    // @Permissions(PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT) TO DO
    ,
    (0, common_1.Get)('interview/:interviewId'),
    tslib_1.__param(0, (0, common_1.Param)('interviewId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "findByInterviewId", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT),
    (0, common_1.Delete)('interview/:interviewId/:feedbackId'),
    tslib_1.__param(0, (0, common_1.Param)('interviewId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('feedbackId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "deleteFeedback", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all candidate feedbacks counts in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidates feedback count'
    }),
    (0, common_1.Get)('count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all candidate feedbacks in the same tenant using pagination.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidates in the tenant',
        type: candidate_feedbacks_entity_1.CandidateFeedback
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate feedback.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate feedback',
        type: candidate_feedbacks_entity_1.CandidateFeedback
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find candidate feedback by id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate feedback',
        type: candidate_feedbacks_entity_1.CandidateFeedback
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "findById", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateFeedbacksController.prototype, "update", null);
exports.CandidateFeedbacksController = CandidateFeedbacksController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateFeedback'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/candidate-feedbacks'),
    tslib_1.__metadata("design:paramtypes", [candidate_feedbacks_service_1.CandidateFeedbacksService,
        cqrs_1.CommandBus])
], CandidateFeedbacksController);
//# sourceMappingURL=candidate-feedbacks.controller.js.map
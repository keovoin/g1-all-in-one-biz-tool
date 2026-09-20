"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewersController = void 0;
const tslib_1 = require("tslib");
const candidate_interviewers_entity_1 = require("./candidate-interviewers.entity");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_interviewers_service_1 = require("./candidate-interviewers.service");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
let CandidateInterviewersController = class CandidateInterviewersController extends crud_1.CrudController {
    constructor(candidateInterviewersService, commandBus) {
        super(candidateInterviewersService);
        this.candidateInterviewersService = candidateInterviewersService;
        this.commandBus = commandBus;
    }
    /**
     * CREATE bulk candidate interviewers
     *
     * @param body
     * @returns
     */
    async createBulk(body) {
        return await this.commandBus.execute(new commands_1.CandidateInterviewersBulkCreateCommand(body));
    }
    /**
     * GET candidate interviewers by interview id
     *
     * @param interviewId
     * @returns
     */
    async findByInterviewId(interviewId) {
        return await this.candidateInterviewersService.getInterviewersByInterviewId(interviewId);
    }
    /**
     * DELETE bulk interviewer by interview id
     *
     * @param id
     * @returns
     */
    async deleteBulkByInterviewId(id) {
        return await this.commandBus.execute(new commands_1.CandidateInterviewersInterviewBulkDeleteCommand(id));
    }
    /**
     * DELETE candidate interviewers by bulk employee ids
     *
     * @param data
     * @returns
     */
    async deleteBulkByEmployeeId(data) {
        const { deleteInput = null } = data;
        return this.commandBus.execute(new commands_1.CandidateInterviewersEmployeeBulkDeleteCommand(deleteInput));
    }
    /**
     * GET all candidate interviewers
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { findInput = null } = data;
        return this.candidateInterviewersService.findAll({ where: findInput });
    }
    /**
     * CREATE candidate interviewer
     *
     * @param body
     * @returns
     */
    async create(body) {
        return this.candidateInterviewersService.create(body);
    }
};
exports.CandidateInterviewersController = CandidateInterviewersController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create interviewers in Bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Interviewers have been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateInterviewersController.prototype, "createBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Interviewers By Interview Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate interviewers',
        type: candidate_interviewers_entity_1.CandidateInterviewers
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_VIEW),
    (0, common_1.Get)('interview/:interviewId'),
    tslib_1.__param(0, (0, common_1.Param)('interviewId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateInterviewersController.prototype, "findByInterviewId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Interviewers By Interview Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate interviewers',
        type: candidate_interviewers_entity_1.CandidateInterviewers
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Delete)('interview/:interviewId'),
    tslib_1.__param(0, (0, common_1.Param)('interviewId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateInterviewersController.prototype, "deleteBulkByInterviewId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Interviewers By employeeId.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate interviewers',
        type: candidate_interviewers_entity_1.CandidateInterviewers
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Delete)('deleteBulkByEmployeeId'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateInterviewersController.prototype, "deleteBulkByEmployeeId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate interviewers.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate interviewers',
        type: candidate_interviewers_entity_1.CandidateInterviewers
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateInterviewersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create new record interviewers'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Success Add Interviewers',
        type: candidate_interviewers_entity_1.CandidateInterviewers
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateInterviewersController.prototype, "create", null);
exports.CandidateInterviewersController = CandidateInterviewersController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateInterviewer'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT),
    (0, common_1.Controller)('/candidate-interviewers'),
    tslib_1.__metadata("design:paramtypes", [candidate_interviewers_service_1.CandidateInterviewersService,
        cqrs_1.CommandBus])
], CandidateInterviewersController);
//# sourceMappingURL=candidate-interviewers.controller.js.map
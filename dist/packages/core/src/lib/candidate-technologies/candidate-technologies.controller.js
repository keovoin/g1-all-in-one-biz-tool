"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologiesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const candidate_technologies_service_1 = require("./candidate-technologies.service");
const candidate_technologies_entity_1 = require("./candidate-technologies.entity");
const commands_1 = require("./commands");
let CandidateTechnologiesController = class CandidateTechnologiesController extends crud_1.CrudController {
    constructor(candidateTechnologiesService, commandBus) {
        super(candidateTechnologiesService);
        this.candidateTechnologiesService = candidateTechnologiesService;
        this.commandBus = commandBus;
    }
    /**
     * CREATE bulk candidate technologies
     *
     * @param body
     * @returns
     */
    async createBulkCandidateTechnologies(body) {
        const { interviewId = null, technologies = [] } = body;
        return await this.commandBus.execute(new commands_1.CandidateTechnologiesBulkCreateCommand(interviewId, technologies));
    }
    /**
     * UPDATE bulk candidate technologies
     *
     * @param body
     * @returns
     */
    async updateBulkCandidateTechnologies(body) {
        return await this.commandBus.execute(new commands_1.CandidateTechnologiesBulkUpdateCommand(body));
    }
    /**
     * GET candidate technology by feedback id
     *
     * @param interviewId
     * @returns
     */
    async findByInterviewId(interviewId) {
        return await this.candidateTechnologiesService.getTechnologiesByInterviewId(interviewId);
    }
    /**
     * DELETE bulk candidate technology by id
     *
     * @param id
     * @param data
     * @returns
     */
    async deleteBulkTechnologies(id, data) {
        const { technologies = null } = data;
        return await this.commandBus.execute(new commands_1.CandidateTechnologiesBulkDeleteCommand(id, technologies));
    }
    /**
     * GET all candidate technologies
     *
     * @param data
     * @returns
     */
    findAll(data) {
        const { findInput, relations } = data;
        return this.candidateTechnologiesService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * CREATE candidate technologies
     *
     * @param body
     * @returns
     */
    async create(body) {
        return this.candidateTechnologiesService.create(body);
    }
    /**
     * DELETE candidate technologies by id
     *
     * @param id
     * @returns
     */
    delete(id) {
        return this.candidateTechnologiesService.delete(id);
    }
};
exports.CandidateTechnologiesController = CandidateTechnologiesController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Post)('bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateTechnologiesController.prototype, "createBulkCandidateTechnologies", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Put)('bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateTechnologiesController.prototype, "updateBulkCandidateTechnologies", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Get)('interview/:interviewId'),
    tslib_1.__param(0, (0, common_1.Param)('interviewId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateTechnologiesController.prototype, "findByInterviewId", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Delete)('bulk/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateTechnologiesController.prototype, "deleteBulkTechnologies", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all candidate technologies.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate technologies',
        type: candidate_technologies_entity_1.CandidateTechnologies
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
], CandidateTechnologiesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [candidate_technologies_entity_1.CandidateTechnologies]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateTechnologiesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.CANDIDATE, contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateTechnologiesController.prototype, "delete", null);
exports.CandidateTechnologiesController = CandidateTechnologiesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateTechnology'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/candidate-technologies'),
    tslib_1.__metadata("design:paramtypes", [candidate_technologies_service_1.CandidateTechnologiesService,
        cqrs_1.CommandBus])
], CandidateTechnologiesController);
//# sourceMappingURL=candidate-technologies.controller.js.map
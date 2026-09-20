"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateDocumentsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const candidate_documents_service_1 = require("./candidate-documents.service");
const candidate_documents_entity_1 = require("./candidate-documents.entity");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("../shared/pipes");
let CandidateDocumentsController = class CandidateDocumentsController extends crud_1.CrudController {
    constructor(candidateDocumentsService) {
        super(candidateDocumentsService);
        this.candidateDocumentsService = candidateDocumentsService;
    }
    /**
     * GET all candidate documents
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.candidateDocumentsService.findAll({
            where: params.where
        });
    }
};
exports.CandidateDocumentsController = CandidateDocumentsController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all candidate document.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found candidate document',
        type: candidate_documents_entity_1.CandidateDocument
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CandidateDocumentsController.prototype, "findAll", null);
exports.CandidateDocumentsController = CandidateDocumentsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('CandidateDocument'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT),
    (0, common_1.Controller)('/candidate-documents'),
    tslib_1.__metadata("design:paramtypes", [candidate_documents_service_1.CandidateDocumentsService])
], CandidateDocumentsController);
//# sourceMappingURL=candidate-documents.controller.js.map
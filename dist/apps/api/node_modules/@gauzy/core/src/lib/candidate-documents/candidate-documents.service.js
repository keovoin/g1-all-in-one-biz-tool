"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateDocumentsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_document_repository_1 = require("./repository/type-orm-candidate-document.repository");
const mikro_orm_candidate_document_repository_1 = require("./repository/mikro-orm-candidate-document.repository");
let CandidateDocumentsService = class CandidateDocumentsService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateDocumentsRepository, mikroOrmCandidateDocumentRepository) {
        super(typeOrmCandidateDocumentsRepository, mikroOrmCandidateDocumentRepository);
    }
};
exports.CandidateDocumentsService = CandidateDocumentsService;
exports.CandidateDocumentsService = CandidateDocumentsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_document_repository_1.TypeOrmCandidateDocumentRepository,
        mikro_orm_candidate_document_repository_1.MikroOrmCandidateDocumentRepository])
], CandidateDocumentsService);
//# sourceMappingURL=candidate-documents.service.js.map
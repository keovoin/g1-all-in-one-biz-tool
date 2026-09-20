"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateDocument = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_document_repository_1 = require("./repository/mikro-orm-candidate-document.repository");
let CandidateDocument = class CandidateDocument extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateDocument = CandidateDocument;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateDocument.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CandidateDocument.prototype, "documentUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Candidate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Candidate, (candidate) => candidate.documents, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateDocument.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.candidate),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateDocument.prototype, "candidateId", void 0);
exports.CandidateDocument = CandidateDocument = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_document', { mikroOrmRepository: () => mikro_orm_candidate_document_repository_1.MikroOrmCandidateDocumentRepository })
], CandidateDocument);
//# sourceMappingURL=candidate-documents.entity.js.map
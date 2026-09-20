"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateDocumentsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_documents_controller_1 = require("./candidate-documents.controller");
const candidate_documents_entity_1 = require("./candidate-documents.entity");
const candidate_documents_service_1 = require("./candidate-documents.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_candidate_document_repository_1 = require("./repository/type-orm-candidate-document.repository");
const mikro_orm_candidate_document_repository_1 = require("./repository/mikro-orm-candidate-document.repository");
let CandidateDocumentsModule = class CandidateDocumentsModule {
};
exports.CandidateDocumentsModule = CandidateDocumentsModule;
exports.CandidateDocumentsModule = CandidateDocumentsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_documents_entity_1.CandidateDocument]),
            nestjs_1.MikroOrmModule.forFeature([candidate_documents_entity_1.CandidateDocument]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [candidate_documents_controller_1.CandidateDocumentsController],
        providers: [candidate_documents_service_1.CandidateDocumentsService, type_orm_candidate_document_repository_1.TypeOrmCandidateDocumentRepository, mikro_orm_candidate_document_repository_1.MikroOrmCandidateDocumentRepository]
    })
], CandidateDocumentsModule);
//# sourceMappingURL=candidate-documents.module.js.map
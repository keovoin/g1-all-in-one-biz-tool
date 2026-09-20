"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRepositories = void 0;
const tslib_1 = require("tslib");
const type_orm_document_repository_1 = require("./type-orm-document.repository");
const type_orm_document_category_repository_1 = require("./type-orm-document-category.repository");
const type_orm_document_chunk_repository_1 = require("./type-orm-document-chunk.repository");
const type_orm_document_index_state_repository_1 = require("./type-orm-document-index-state.repository");
const type_orm_document_link_repository_1 = require("./type-orm-document-link.repository");
const type_orm_document_share_repository_1 = require("./type-orm-document-share.repository");
const type_orm_document_version_repository_1 = require("./type-orm-document-version.repository");
const type_orm_document_inbound_address_repository_1 = require("./type-orm-document-inbound-address.repository");
tslib_1.__exportStar(require("./mikro-orm-document.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-category.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-chunk.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-index-state.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-link.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-share.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-version.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-document-inbound-address.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-category.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-chunk.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-index-state.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-link.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-share.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-version.repository"), exports);
tslib_1.__exportStar(require("./type-orm-document-inbound-address.repository"), exports);
/**
 * TypeORM repository providers registered in `DocsModule`.
 * (The MikroORM repositories are instantiated by MikroORM itself through the
 * `mikroOrmRepository` entity option — they are not Nest providers.)
 */
exports.TypeOrmRepositories = [
    type_orm_document_repository_1.TypeOrmDocumentRepository,
    type_orm_document_category_repository_1.TypeOrmDocumentCategoryRepository,
    type_orm_document_version_repository_1.TypeOrmDocumentVersionRepository,
    type_orm_document_chunk_repository_1.TypeOrmDocumentChunkRepository,
    type_orm_document_index_state_repository_1.TypeOrmDocumentIndexStateRepository,
    type_orm_document_share_repository_1.TypeOrmDocumentShareRepository,
    type_orm_document_link_repository_1.TypeOrmDocumentLinkRepository,
    type_orm_document_inbound_address_repository_1.TypeOrmDocumentInboundAddressRepository
];
//# sourceMappingURL=index.js.map
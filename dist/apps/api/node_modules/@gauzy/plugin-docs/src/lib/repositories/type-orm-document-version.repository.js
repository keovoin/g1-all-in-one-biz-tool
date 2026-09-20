"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDocumentVersionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_version_entity_1 = require("../entities/document-version.entity");
let TypeOrmDocumentVersionRepository = class TypeOrmDocumentVersionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDocumentVersionRepository = TypeOrmDocumentVersionRepository;
exports.TypeOrmDocumentVersionRepository = TypeOrmDocumentVersionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_version_entity_1.DocumentVersion)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDocumentVersionRepository);
//# sourceMappingURL=type-orm-document-version.repository.js.map
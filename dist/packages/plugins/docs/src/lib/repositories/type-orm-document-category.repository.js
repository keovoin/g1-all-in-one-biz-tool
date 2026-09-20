"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDocumentCategoryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_category_entity_1 = require("../entities/document-category.entity");
let TypeOrmDocumentCategoryRepository = class TypeOrmDocumentCategoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDocumentCategoryRepository = TypeOrmDocumentCategoryRepository;
exports.TypeOrmDocumentCategoryRepository = TypeOrmDocumentCategoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_category_entity_1.DocumentCategory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDocumentCategoryRepository);
//# sourceMappingURL=type-orm-document-category.repository.js.map
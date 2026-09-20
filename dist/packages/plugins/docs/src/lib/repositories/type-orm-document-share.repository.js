"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDocumentShareRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_share_entity_1 = require("../entities/document-share.entity");
let TypeOrmDocumentShareRepository = class TypeOrmDocumentShareRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDocumentShareRepository = TypeOrmDocumentShareRepository;
exports.TypeOrmDocumentShareRepository = TypeOrmDocumentShareRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_share_entity_1.DocumentShare)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDocumentShareRepository);
//# sourceMappingURL=type-orm-document-share.repository.js.map
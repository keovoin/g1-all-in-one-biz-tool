"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDocumentIndexStateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_index_state_entity_1 = require("../entities/document-index-state.entity");
let TypeOrmDocumentIndexStateRepository = class TypeOrmDocumentIndexStateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDocumentIndexStateRepository = TypeOrmDocumentIndexStateRepository;
exports.TypeOrmDocumentIndexStateRepository = TypeOrmDocumentIndexStateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(document_index_state_entity_1.DocumentIndexState)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDocumentIndexStateRepository);
//# sourceMappingURL=type-orm-document-index-state.repository.js.map
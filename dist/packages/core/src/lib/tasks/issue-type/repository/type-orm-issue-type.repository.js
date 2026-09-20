"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIssueTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const issue_type_entity_1 = require("../issue-type.entity");
let TypeOrmIssueTypeRepository = class TypeOrmIssueTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIssueTypeRepository = TypeOrmIssueTypeRepository;
exports.TypeOrmIssueTypeRepository = TypeOrmIssueTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(issue_type_entity_1.IssueType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIssueTypeRepository);
//# sourceMappingURL=type-orm-issue-type.repository.js.map
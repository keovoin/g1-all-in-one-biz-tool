"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTaskRelatedIssueTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const related_issue_type_entity_1 = require("../related-issue-type.entity");
let TypeOrmTaskRelatedIssueTypeRepository = class TypeOrmTaskRelatedIssueTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTaskRelatedIssueTypeRepository = TypeOrmTaskRelatedIssueTypeRepository;
exports.TypeOrmTaskRelatedIssueTypeRepository = TypeOrmTaskRelatedIssueTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(related_issue_type_entity_1.TaskRelatedIssueType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTaskRelatedIssueTypeRepository);
//# sourceMappingURL=type-orm-related-issue-type.repository.js.map
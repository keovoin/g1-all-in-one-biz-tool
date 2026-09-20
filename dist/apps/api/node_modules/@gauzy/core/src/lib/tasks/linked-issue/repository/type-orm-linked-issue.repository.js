"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTaskLinkedIssueRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_linked_issue_entity_1 = require("../task-linked-issue.entity");
let TypeOrmTaskLinkedIssueRepository = class TypeOrmTaskLinkedIssueRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTaskLinkedIssueRepository = TypeOrmTaskLinkedIssueRepository;
exports.TypeOrmTaskLinkedIssueRepository = TypeOrmTaskLinkedIssueRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_linked_issue_entity_1.TaskLinkedIssue)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTaskLinkedIssueRepository);
//# sourceMappingURL=type-orm-linked-issue.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeProposalTemplateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_proposal_template_entity_1 = require("../employee-proposal-template.entity");
let TypeOrmEmployeeProposalTemplateRepository = class TypeOrmEmployeeProposalTemplateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeProposalTemplateRepository = TypeOrmEmployeeProposalTemplateRepository;
exports.TypeOrmEmployeeProposalTemplateRepository = TypeOrmEmployeeProposalTemplateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_proposal_template_entity_1.EmployeeProposalTemplate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeProposalTemplateRepository);
//# sourceMappingURL=type-orm-employee-proposal-template.repository.js.map
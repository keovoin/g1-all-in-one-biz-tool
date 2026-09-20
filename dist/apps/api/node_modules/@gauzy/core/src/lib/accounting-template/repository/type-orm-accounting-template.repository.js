"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmAccountingTemplateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const accounting_template_entity_1 = require("../accounting-template.entity");
let TypeOrmAccountingTemplateRepository = class TypeOrmAccountingTemplateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmAccountingTemplateRepository = TypeOrmAccountingTemplateRepository;
exports.TypeOrmAccountingTemplateRepository = TypeOrmAccountingTemplateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(accounting_template_entity_1.AccountingTemplate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmAccountingTemplateRepository);
//# sourceMappingURL=type-orm-accounting-template.repository.js.map
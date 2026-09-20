"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmailTemplateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_template_entity_1 = require("../email-template.entity");
let TypeOrmEmailTemplateRepository = class TypeOrmEmailTemplateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmailTemplateRepository = TypeOrmEmailTemplateRepository;
exports.TypeOrmEmailTemplateRepository = TypeOrmEmailTemplateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(email_template_entity_1.EmailTemplate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmailTemplateRepository);
//# sourceMappingURL=type-orm-email-template.repository.js.map
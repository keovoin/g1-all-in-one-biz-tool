"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmailResetRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_reset_entity_1 = require("../email-reset.entity");
let TypeOrmEmailResetRepository = class TypeOrmEmailResetRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmailResetRepository = TypeOrmEmailResetRepository;
exports.TypeOrmEmailResetRepository = TypeOrmEmailResetRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(email_reset_entity_1.EmailReset)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmailResetRepository);
//# sourceMappingURL=type-orm-email-reset.repository.js.map
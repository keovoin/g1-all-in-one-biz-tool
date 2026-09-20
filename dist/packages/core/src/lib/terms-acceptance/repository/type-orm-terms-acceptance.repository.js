"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTermsAcceptanceRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const terms_acceptance_entity_1 = require("../terms-acceptance.entity");
let TypeOrmTermsAcceptanceRepository = class TypeOrmTermsAcceptanceRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTermsAcceptanceRepository = TypeOrmTermsAcceptanceRepository;
exports.TypeOrmTermsAcceptanceRepository = TypeOrmTermsAcceptanceRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(terms_acceptance_entity_1.TermsAcceptance)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTermsAcceptanceRepository);
//# sourceMappingURL=type-orm-terms-acceptance.repository.js.map
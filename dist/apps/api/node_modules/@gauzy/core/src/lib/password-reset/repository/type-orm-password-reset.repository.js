"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPasswordResetRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const password_reset_entity_1 = require("../password-reset.entity");
let TypeOrmPasswordResetRepository = class TypeOrmPasswordResetRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPasswordResetRepository = TypeOrmPasswordResetRepository;
exports.TypeOrmPasswordResetRepository = TypeOrmPasswordResetRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(password_reset_entity_1.PasswordReset)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPasswordResetRepository);
//# sourceMappingURL=type-orm-password-reset.repository.js.map
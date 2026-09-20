"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmKeyResultUpdateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const keyresult_update_entity_1 = require("../keyresult-update.entity");
let TypeOrmKeyResultUpdateRepository = class TypeOrmKeyResultUpdateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmKeyResultUpdateRepository = TypeOrmKeyResultUpdateRepository;
exports.TypeOrmKeyResultUpdateRepository = TypeOrmKeyResultUpdateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(keyresult_update_entity_1.KeyResultUpdate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmKeyResultUpdateRepository);
//# sourceMappingURL=type-orm-keyresult-update.repository.js.map
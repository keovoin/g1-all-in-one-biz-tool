"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmMentionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mention_entity_1 = require("../mention.entity");
let TypeOrmMentionRepository = class TypeOrmMentionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmMentionRepository = TypeOrmMentionRepository;
exports.TypeOrmMentionRepository = TypeOrmMentionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(mention_entity_1.Mention)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmMentionRepository);
//# sourceMappingURL=type-orm-mention.repository.js.map
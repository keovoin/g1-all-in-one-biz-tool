"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmChangelogRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const changelog_entity_1 = require("../changelog.entity");
let TypeOrmChangelogRepository = class TypeOrmChangelogRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmChangelogRepository = TypeOrmChangelogRepository;
exports.TypeOrmChangelogRepository = TypeOrmChangelogRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(changelog_entity_1.Changelog)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmChangelogRepository);
//# sourceMappingURL=type-orm-changelog.repository.js.map
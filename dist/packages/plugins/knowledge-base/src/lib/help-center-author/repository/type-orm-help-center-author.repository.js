"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmHelpCenterAuthorRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const help_center_author_entity_1 = require("../help-center-author.entity");
let TypeOrmHelpCenterAuthorRepository = class TypeOrmHelpCenterAuthorRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmHelpCenterAuthorRepository = TypeOrmHelpCenterAuthorRepository;
exports.TypeOrmHelpCenterAuthorRepository = TypeOrmHelpCenterAuthorRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(help_center_author_entity_1.HelpCenterAuthor)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmHelpCenterAuthorRepository);
//# sourceMappingURL=type-orm-help-center-author.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmResourceLinkRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_link_entity_1 = require("../resource-link.entity");
let TypeOrmResourceLinkRepository = class TypeOrmResourceLinkRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmResourceLinkRepository = TypeOrmResourceLinkRepository;
exports.TypeOrmResourceLinkRepository = TypeOrmResourceLinkRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(resource_link_entity_1.ResourceLink)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmResourceLinkRepository);
//# sourceMappingURL=type-orm-resource-link.repository.js.map
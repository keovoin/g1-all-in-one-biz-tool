"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmContactRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("../contact.entity");
let TypeOrmContactRepository = class TypeOrmContactRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmContactRepository = TypeOrmContactRepository;
exports.TypeOrmContactRepository = TypeOrmContactRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmContactRepository);
//# sourceMappingURL=type-orm-contact.repository.js.map
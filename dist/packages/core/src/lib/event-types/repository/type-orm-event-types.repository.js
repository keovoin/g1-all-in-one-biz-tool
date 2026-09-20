"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEventTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_type_entity_1 = require("../event-type.entity");
let TypeOrmEventTypeRepository = class TypeOrmEventTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEventTypeRepository = TypeOrmEventTypeRepository;
exports.TypeOrmEventTypeRepository = TypeOrmEventTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(event_type_entity_1.EventType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEventTypeRepository);
//# sourceMappingURL=type-orm-event-types.repository.js.map
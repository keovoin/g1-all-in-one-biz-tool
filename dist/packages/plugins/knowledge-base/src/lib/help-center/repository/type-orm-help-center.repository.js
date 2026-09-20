"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmHelpCenterRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const help_center_entity_1 = require("../help-center.entity");
let TypeOrmHelpCenterRepository = class TypeOrmHelpCenterRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmHelpCenterRepository = TypeOrmHelpCenterRepository;
exports.TypeOrmHelpCenterRepository = TypeOrmHelpCenterRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(help_center_entity_1.HelpCenter)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmHelpCenterRepository);
//# sourceMappingURL=type-orm-help-center.repository.js.map
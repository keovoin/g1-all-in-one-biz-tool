"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmInviteRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invite_entity_1 = require("../invite.entity");
let TypeOrmInviteRepository = class TypeOrmInviteRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmInviteRepository = TypeOrmInviteRepository;
exports.TypeOrmInviteRepository = TypeOrmInviteRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(invite_entity_1.Invite)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmInviteRepository);
//# sourceMappingURL=type-orm-invite.repository.js.map
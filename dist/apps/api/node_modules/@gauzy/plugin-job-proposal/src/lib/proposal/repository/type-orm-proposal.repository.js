"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProposalRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proposal_entity_1 = require("../proposal.entity");
let TypeOrmProposalRepository = class TypeOrmProposalRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProposalRepository = TypeOrmProposalRepository;
exports.TypeOrmProposalRepository = TypeOrmProposalRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(proposal_entity_1.Proposal)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProposalRepository);
//# sourceMappingURL=type-orm-proposal.repository.js.map
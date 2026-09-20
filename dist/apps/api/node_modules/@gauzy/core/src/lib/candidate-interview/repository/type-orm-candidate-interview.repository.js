"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateInterviewRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_interview_entity_1 = require("../candidate-interview.entity");
let TypeOrmCandidateInterviewRepository = class TypeOrmCandidateInterviewRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateInterviewRepository = TypeOrmCandidateInterviewRepository;
exports.TypeOrmCandidateInterviewRepository = TypeOrmCandidateInterviewRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_interview_entity_1.CandidateInterview)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateInterviewRepository);
//# sourceMappingURL=type-orm-candidate-interview.repository.js.map
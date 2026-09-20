"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCandidateFeedbackRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_feedbacks_entity_1 = require("../candidate-feedbacks.entity");
let TypeOrmCandidateFeedbackRepository = class TypeOrmCandidateFeedbackRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCandidateFeedbackRepository = TypeOrmCandidateFeedbackRepository;
exports.TypeOrmCandidateFeedbackRepository = TypeOrmCandidateFeedbackRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(candidate_feedbacks_entity_1.CandidateFeedback)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCandidateFeedbackRepository);
//# sourceMappingURL=type-orm-candidate-feedback.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewersService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_interviewers_repository_1 = require("./repository/type-orm-candidate-interviewers.repository");
const mikro_orm_candidate_interviewers_repository_1 = require("./repository/mikro-orm-candidate-interviewers.repository");
let CandidateInterviewersService = class CandidateInterviewersService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateInterviewersRepository, mikroOrmCandidateInterviewersRepository) {
        super(typeOrmCandidateInterviewersRepository, mikroOrmCandidateInterviewersRepository);
    }
    /**
     * Get interviewers by interview ID.
     */
    async getInterviewersByInterviewId(interviewId) {
        return await this.find({
            where: { interviewId }
        });
    }
    /**
     * Create interviewers in bulk.
     */
    async createBulk(input = []) {
        if (!input.length) {
            return [];
        }
        const interviewers = input.flatMap(({ employeeId, employeeIds, ...rest }) => {
            if (employeeIds?.length) {
                return employeeIds.map((id) => ({
                    ...rest,
                    employeeId: id
                }));
            }
            if (employeeId) {
                return [
                    {
                        ...rest,
                        employeeId
                    }
                ];
            }
            return [];
        });
        return interviewers.length ? this.saveMany(interviewers) : [];
    }
};
exports.CandidateInterviewersService = CandidateInterviewersService;
exports.CandidateInterviewersService = CandidateInterviewersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_interviewers_repository_1.TypeOrmCandidateInterviewersRepository,
        mikro_orm_candidate_interviewers_repository_1.MikroOrmCandidateInterviewersRepository])
], CandidateInterviewersService);
//# sourceMappingURL=candidate-interviewers.service.js.map
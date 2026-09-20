"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateHiredHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const candidate_service_1 = require("../../candidate.service");
const candidate_hired_command_1 = require("../candidate.hired.command");
const employee_service_1 = require("./../../../employee/employee.service");
const user_service_1 = require("./../../../user/user.service");
const role_service_1 = require("./../../../role/role.service");
let CandidateHiredHandler = class CandidateHiredHandler {
    constructor(candidateService, employeeService, userService, roleService) {
        this.candidateService = candidateService;
        this.employeeService = employeeService;
        this.userService = userService;
        this.roleService = roleService;
    }
    /**
     * Executes the process of hiring a candidate.
     *
     * @param {CandidateHiredCommand} command - The command containing the candidate ID.
     * @returns {Promise<ICandidate>} - The updated candidate object.
     * @throws {ConflictException} - If the candidate is already hired.
     * @throws {BadRequestException} - If there is an error during the update process.
     */
    async execute({ id }) {
        // Fetch the candidate with the necessary relations
        const candidate = await this.candidateService.findOneByIdString(id, {
            relations: {
                user: true,
                tags: true
            }
        });
        // Check if the candidate is already hired
        if (candidate.alreadyHired) {
            throw new common_1.ConflictException('The candidate is already hired, you cannot hire them again.');
        }
        try {
            const hiredDate = new Date();
            // Step 1: Create an employee for the respective candidate
            const employee = await this.employeeService.create({
                billRateValue: candidate.billRateValue,
                billRateCurrency: candidate.billRateCurrency,
                reWeeklyLimit: candidate.reWeeklyLimit,
                payPeriod: candidate.payPeriod,
                tenantId: candidate.tenantId,
                organizationId: candidate.organizationId,
                userId: candidate.userId,
                contactId: candidate.contactId,
                organizationPositionId: candidate.organizationPositionId,
                tags: candidate.tags,
                isActive: true,
                startedWorkOn: hiredDate
            });
            // Step 2: Migrate CANDIDATE role to EMPLOYEE role
            const role = await this.roleService.findOneByWhereOptions({ name: contracts_1.RolesEnum.EMPLOYEE });
            await this.userService.create({
                id: candidate.userId,
                role
            });
            // Step 3 & 4: Convert candidate to employee user and update hired candidate details
            return await this.candidateService.create({
                id,
                status: contracts_1.CandidateStatusEnum.HIRED,
                hiredDate: hiredDate,
                rejectDate: null,
                employee,
                isActive: true,
                isArchived: false
            });
        }
        catch (error) {
            // Handle any errors that occur during the update process
            throw new common_1.BadRequestException(error.message || error);
        }
    }
};
exports.CandidateHiredHandler = CandidateHiredHandler;
exports.CandidateHiredHandler = CandidateHiredHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_hired_command_1.CandidateHiredCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_service_1.CandidateService,
        employee_service_1.EmployeeService,
        user_service_1.UserService,
        role_service_1.RoleService])
], CandidateHiredHandler);
//# sourceMappingURL=candidate.hired.handler.js.map
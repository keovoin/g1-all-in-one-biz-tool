"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRejectedHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const candidate_service_1 = require("../../candidate.service");
const candidate_rejected_command_1 = require("../candidate.rejected.command");
const email_service_1 = require("./../../../email-send/email.service");
let CandidateRejectedHandler = class CandidateRejectedHandler {
    constructor(candidateService, _emailService) {
        this.candidateService = candidateService;
        this._emailService = _emailService;
    }
    /**
     * Executes the candidate rejection process.
     *
     * @param {CandidateRejectedCommand} command - The command containing the candidate ID.
     * @returns {Promise<ICandidate>} - The updated candidate object.
     * @throws {ConflictException} - If the candidate is already hired.
     * @throws {BadRequestException} - If there is an error during the update process.
     */
    async execute({ id }) {
        // Fetch the candidate by ID
        const candidate = await this.candidateService.findOneByIdString(id, {
            relations: { user: true, organization: true }
        });
        // Check if the candidate is already hired
        if (candidate.alreadyHired) {
            throw new common_1.ConflictException('The candidate is already hired, you cannot reject it.');
        }
        try {
            // Prepare the updated candidate data
            const updatedCandidate = {
                status: contracts_1.CandidateStatusEnum.REJECTED,
                rejectDate: candidate.rejectDate || new Date(), // Use existing reject date or current date
                hiredDate: null // Clear the hired date
            };
            // Update the candidate in the database
            await this.candidateService.update(id, updatedCandidate);
            // Send rejection email to candidate
            const languageCode = candidate.user.preferredLanguage;
            const { email, name } = candidate.user;
            const organization = candidate.organization;
            const originUrl = config_1.environment.clientBaseUrl;
            // Call the email service to send the rejection email
            this._emailService.sendRejectionEmail(languageCode || contracts_1.LanguagesEnum.ENGLISH, email, name, organization, originUrl);
            // Return the merged candidate object with the updated data
            return { ...candidate, ...updatedCandidate };
        }
        catch (error) {
            // Handle any errors that occur during the update process
            throw new common_1.BadRequestException(error.message || error);
        }
    }
};
exports.CandidateRejectedHandler = CandidateRejectedHandler;
exports.CandidateRejectedHandler = CandidateRejectedHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_rejected_command_1.CandidateRejectedCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_service_1.CandidateService, email_service_1.EmailService])
], CandidateRejectedHandler);
//# sourceMappingURL=candidate.rejected.handler.js.map
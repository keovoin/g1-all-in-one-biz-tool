import { ICommandHandler } from '@nestjs/cqrs';
import { ICandidate } from '@gauzy/contracts';
import { CandidateService } from '../../candidate.service';
import { CandidateRejectedCommand } from '../candidate.rejected.command';
import { EmailService } from './../../../email-send/email.service';
export declare class CandidateRejectedHandler implements ICommandHandler<CandidateRejectedCommand> {
    private readonly candidateService;
    private readonly _emailService;
    constructor(candidateService: CandidateService, _emailService: EmailService);
    /**
     * Executes the candidate rejection process.
     *
     * @param {CandidateRejectedCommand} command - The command containing the candidate ID.
     * @returns {Promise<ICandidate>} - The updated candidate object.
     * @throws {ConflictException} - If the candidate is already hired.
     * @throws {BadRequestException} - If there is an error during the update process.
     */
    execute({ id }: CandidateRejectedCommand): Promise<ICandidate>;
}

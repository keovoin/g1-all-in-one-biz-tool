import { ICandidateCriterionsRating } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { CandidateCriterionsRatingService } from '../../candidate-criterion-rating.service';
import { CandidateCriterionsRatingBulkUpdateCommand } from '../candidate-criterions-rating.bulk.update.command';
export declare class CandidateCriterionsRatingBulkUpdateHandler implements ICommandHandler<CandidateCriterionsRatingBulkUpdateCommand> {
    private readonly candidateCriterionsRatingService;
    constructor(candidateCriterionsRatingService: CandidateCriterionsRatingService);
    execute(command: CandidateCriterionsRatingBulkUpdateCommand): Promise<any>;
    setRating(ratings: number[], data: ICandidateCriterionsRating[]): ICandidateCriterionsRating[];
}

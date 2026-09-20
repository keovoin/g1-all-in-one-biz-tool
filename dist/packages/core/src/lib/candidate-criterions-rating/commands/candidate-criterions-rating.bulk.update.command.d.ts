import { ICommand } from '@nestjs/cqrs';
import { ICandidateCriterionsRating } from '@gauzy/contracts';
export declare class CandidateCriterionsRatingBulkUpdateCommand implements ICommand {
    readonly data: {
        criterionsRating: ICandidateCriterionsRating[];
        technologies: number[];
        personalQualities: number[];
    };
    static readonly type = "[CandidateCriterionsRating] Update";
    constructor(data: {
        criterionsRating: ICandidateCriterionsRating[];
        technologies: number[];
        personalQualities: number[];
    });
}

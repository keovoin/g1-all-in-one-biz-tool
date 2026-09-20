import { ICommand } from '@nestjs/cqrs';
import { ICandidateFeedback } from '@gauzy/contracts';
export declare class FeedbackUpdateCommand implements ICommand {
    readonly id: string;
    readonly entity: ICandidateFeedback;
    static readonly type = "[Feedback] Update";
    constructor(id: string, entity: ICandidateFeedback);
}

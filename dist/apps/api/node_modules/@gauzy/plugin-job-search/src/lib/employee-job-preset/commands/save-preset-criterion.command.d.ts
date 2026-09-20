import { IMatchingCriterions } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class SavePresetCriterionCommand implements ICommand {
    readonly input?: IMatchingCriterions;
    static readonly type = "[JobPresetCriterion] Create";
    constructor(input?: IMatchingCriterions);
}

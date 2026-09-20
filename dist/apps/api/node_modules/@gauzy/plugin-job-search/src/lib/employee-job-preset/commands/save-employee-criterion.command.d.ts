import { IMatchingCriterions } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class SaveEmployeeCriterionCommand implements ICommand {
    readonly input?: IMatchingCriterions;
    static readonly type = "[EmployeeCriterion] Create";
    constructor(input?: IMatchingCriterions);
}

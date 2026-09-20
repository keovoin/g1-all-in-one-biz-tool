import { ICommand } from '@nestjs/cqrs';
import { ICandidateTechnologies } from '@gauzy/contracts';
export declare class CandidateTechnologiesBulkUpdateCommand implements ICommand {
    readonly technologies: ICandidateTechnologies[];
    static readonly type = "[CandidateTechnologies] Update";
    constructor(technologies: ICandidateTechnologies[]);
}

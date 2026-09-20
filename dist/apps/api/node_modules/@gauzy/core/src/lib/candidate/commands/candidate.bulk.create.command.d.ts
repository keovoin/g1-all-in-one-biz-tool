import { ICommand } from '@nestjs/cqrs';
import { ICandidateCreateInput, LanguagesEnum } from '@gauzy/contracts';
export declare class CandidateBulkCreateCommand implements ICommand {
    readonly input: ICandidateCreateInput[];
    readonly languageCode: LanguagesEnum;
    readonly originUrl: string;
    static readonly type = "[Candidate] Bulk Create";
    constructor(input: ICandidateCreateInput[], languageCode: LanguagesEnum, originUrl: string);
}

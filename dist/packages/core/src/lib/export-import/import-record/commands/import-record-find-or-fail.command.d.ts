import { ICommand } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { IImportRecordFind } from '@gauzy/contracts';
export declare class ImportRecordFindOrFailCommand implements ICommand {
    readonly input: FindOptionsWhere<IImportRecordFind>;
    static readonly type = "[Find Or Fail] Import Record";
    constructor(input: FindOptionsWhere<IImportRecordFind>);
}

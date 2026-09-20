import { ICommand } from '@nestjs/cqrs';
import { IImportHistory } from '@gauzy/contracts';
export declare class ImportHistoryCreateCommand implements ICommand {
    readonly input: IImportHistory;
    static readonly type = "[Create] Import History";
    constructor(input: IImportHistory);
}

import { ICommandHandler } from '@nestjs/cqrs';
import { IImportRecord } from '@gauzy/contracts';
import { ImportRecordUpdateOrCreateCommand } from '../import-record-update-or-create.command';
import { ImportRecordService } from '../../import-record.service';
export declare class ImportRecordUpdateOrCreateHandler implements ICommandHandler<ImportRecordUpdateOrCreateCommand> {
    private readonly _importRecordService;
    constructor(_importRecordService: ImportRecordService);
    execute(event: ImportRecordUpdateOrCreateCommand): Promise<IImportRecord>;
}

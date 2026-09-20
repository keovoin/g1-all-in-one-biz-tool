import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { TimeLog } from './../time-log.entity';
export declare class TimeLogDeleteCommand implements ICommand {
    readonly ids: ID | ID[] | TimeLog | TimeLog[];
    readonly forceDelete: boolean;
    static readonly type = "[TimeLog] delete";
    constructor(ids: ID | ID[] | TimeLog | TimeLog[], forceDelete?: boolean);
}

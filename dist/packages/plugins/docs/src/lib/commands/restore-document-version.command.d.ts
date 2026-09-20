import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class RestoreDocumentVersionCommand implements ICommand {
    readonly id: ID;
    readonly versionId: ID;
    static readonly type = "[Document Version] Restore";
    constructor(id: ID, versionId: ID);
}

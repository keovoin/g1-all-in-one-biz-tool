import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { DocumentSettingsDTO } from '../dto';
export declare class UpdateDocumentSettingsCommand implements ICommand {
    readonly organizationId: ID;
    readonly input: DocumentSettingsDTO;
    static readonly type = "[Document Settings] Update";
    constructor(organizationId: ID, input: DocumentSettingsDTO);
}

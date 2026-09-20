import { IEditEntityByMemberInput } from '@gauzy/contracts';
import { CrudService } from '../../core/crud';
export declare abstract class UpdateEntityByMembersHandler {
    private readonly crudService;
    constructor(crudService: CrudService<any>);
    executeCommand(input: IEditEntityByMemberInput): Promise<any>;
}

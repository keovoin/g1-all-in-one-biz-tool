import { IEmployeePresetInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class SaveEmployeePresetCommand implements ICommand {
    readonly input?: IEmployeePresetInput;
    static readonly type = "[EmployeePreset] Create";
    constructor(input?: IEmployeePresetInput);
}

import { ICommand } from '@nestjs/cqrs';
import { ITenantSetting } from '@gauzy/contracts';
export declare class GlobalSettingSaveCommand implements ICommand {
    readonly input: ITenantSetting;
    static readonly type = "[Global] Setting Save";
    constructor(input: ITenantSetting);
}

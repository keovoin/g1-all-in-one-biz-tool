import { ICommand } from '@nestjs/cqrs';
export declare class GlobalSettingGetCommand implements ICommand {
    readonly names?: string[];
    static readonly type = "[Global] Setting Get";
    constructor(names?: string[]);
}

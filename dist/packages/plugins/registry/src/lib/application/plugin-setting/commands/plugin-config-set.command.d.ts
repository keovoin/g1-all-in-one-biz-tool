import { ICommand } from '@nestjs/cqrs';
export declare class PluginConfigSetCommand implements ICommand {
    readonly input: any;
    static readonly type = "[Plugin] Config Set";
    constructor(input: any);
}

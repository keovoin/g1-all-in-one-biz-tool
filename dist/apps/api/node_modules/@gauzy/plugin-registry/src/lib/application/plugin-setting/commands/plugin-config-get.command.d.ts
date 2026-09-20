import { ICommand } from '@nestjs/cqrs';
export declare class PluginConfigGetCommand implements ICommand {
    readonly input: any;
    static readonly type = "[Plugin] Config Get";
    constructor(input: any);
}

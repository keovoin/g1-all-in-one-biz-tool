import { ICommand } from '@nestjs/cqrs';
import { IScreenshotUpdateInput } from '@gauzy/contracts';
export declare class ScreenshotUpdateCommand implements ICommand {
    readonly input: IScreenshotUpdateInput;
    static readonly type = "[Screenshot] Update Screenshot";
    constructor(input: IScreenshotUpdateInput);
}

import { ICommand } from '@nestjs/cqrs';
import { IScreenshotCreateInput } from '@gauzy/contracts';
export declare class ScreenshotCreateCommand implements ICommand {
    readonly input: IScreenshotCreateInput;
    static readonly type = "[Screenshot] Create Screenshot";
    constructor(input: IScreenshotCreateInput);
}

import { ICommand } from '@nestjs/cqrs';
import { IImageAssetCreateInput } from '@gauzy/contracts';
export declare class ImageAssetCreateCommand implements ICommand {
    readonly input: IImageAssetCreateInput;
    static readonly type = "[Image Asset] Create";
    constructor(input: IImageAssetCreateInput);
}

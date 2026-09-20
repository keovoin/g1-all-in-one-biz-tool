import { IImageAsset, ITenant } from "@gauzy/contracts";
export declare class TenantDTO implements ITenant {
    readonly name: string;
    readonly logo: string;
    readonly imageId: IImageAsset['id'];
}

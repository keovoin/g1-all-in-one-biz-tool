import { ITenantCreateInput } from "@gauzy/contracts";
import { TenantDTO } from "./tenant.dto";
export declare class CreateTenantDTO extends TenantDTO implements ITenantCreateInput {
    readonly isImporting: boolean;
    readonly sourceId: string;
    readonly userSourceId: string;
}

import { IImageAsset, IWarehouse } from "@gauzy/contracts";
import { RelationalContactDTO } from "./../../contact/dto";
import { RelationalTagDTO } from "./../../tags/dto";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
declare const WarehouseDTO_base: import("@nestjs/mapped-types").MappedType<RelationalTagDTO & TenantOrganizationBaseDTO & RelationalContactDTO>;
/**
 * Warehouse request DTO validation
 */
export declare class WarehouseDTO extends WarehouseDTO_base implements IWarehouse {
    readonly name: string;
    readonly code: string;
    readonly email: string;
    readonly description: string;
    readonly active: boolean;
    readonly logo: IImageAsset;
    readonly logoId: IImageAsset['id'];
}
export {};

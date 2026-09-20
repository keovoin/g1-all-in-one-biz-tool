import { IRelationalRole, IRole } from "@gauzy/contracts";
export declare class RoleFeatureDTO implements IRelationalRole {
    readonly roleId: string;
    readonly role: IRole;
}

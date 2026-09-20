import { HttpClient } from '@angular/common/http';
import { ID, IEquipmentSharingPolicy, IEquipmentSharingPolicyFindInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EquipmentSharingPolicyService {
    private readonly http;
    EQUIPMENT_SHARING_POLICY_URL: string;
    constructor(http: HttpClient);
    /**
     * Get all equipment sharing policies with optional filtering and relations.
     *
     * @param where - Conditions to filter the equipment sharing policies.
     * @param relations - Optional relations to include in the result.
     * @returns A promise that resolves to a paginated list of equipment sharing policies.
     */
    getAll(where: IEquipmentSharingPolicyFindInput, relations?: string[]): Promise<IPagination<IEquipmentSharingPolicy>>;
    /**
     * Delete an equipment sharing policy by ID.
     *
     * @param id - The ID of the equipment sharing policy to delete.
     * @returns A promise that resolves when the equipment sharing policy has been deleted.
     */
    delete(id: ID): Promise<any>;
    /**
     * Create a new equipment sharing policy.
     *
     * @param input - The equipment sharing policy data to create.
     * @returns A promise that resolves to the created equipment sharing policy.
     */
    create(input: IEquipmentSharingPolicy): Promise<IEquipmentSharingPolicy>;
    /**
     * Update an existing equipment sharing policy.
     *
     * @param id - The ID of the equipment sharing policy to update.
     * @param input - The updated equipment sharing policy data.
     * @returns A promise that resolves to the updated equipment sharing policy.
     */
    update(id: ID, input: IEquipmentSharingPolicy): Promise<IEquipmentSharingPolicy>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EquipmentSharingPolicyService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EquipmentSharingPolicyService>;
}

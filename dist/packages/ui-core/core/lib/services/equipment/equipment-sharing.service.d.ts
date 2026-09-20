import { HttpClient } from '@angular/common/http';
import { ID, IEquipmentSharing, IEquipmentSharingCreateInput, IEquipmentSharingUpdateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EquipmentSharingService {
    private readonly http;
    EQUIPMENT_SHARING_URL: string;
    constructor(http: HttpClient);
    /**
     * Retrieves all equipment sharing records.
     *
     * @returns A promise that resolves to an array of equipment sharing records.
     */
    getAll(): Promise<IEquipmentSharing[]>;
    /**
     * Retrieves equipment sharing records for a specific organization.
     *
     * @param id - The unique identifier of the organization.
     * @returns A promise that resolves to an array of equipment sharing records associated with the given organization.
     */
    getByOrganizationId(id: ID): Promise<IPagination<IEquipmentSharing>>;
    /**
     * Retrieves equipment sharing records by the author (employee) user ID.
     *
     * @param id - The unique identifier of the author user.
     * @returns A promise that resolves to an array of equipment sharing records created by the specified user.
     */
    getByEmployeeId(id: ID): Promise<IPagination<IEquipmentSharing>>;
    /**
     * Deletes an equipment sharing record by its ID.
     *
     * @param id - The unique identifier of the equipment sharing record to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(id: ID): Promise<any>;
    /**
     * Creates a new equipment sharing record for a specific organization.
     *
     * @param equipmentSharing - The input data required to create the equipment sharing record.
     * @param organizationId - The ID of the organization that the record belongs to.
     * @returns A promise that resolves to the newly created equipment sharing record.
     */
    create(equipmentSharing: IEquipmentSharingCreateInput, organizationId: ID): Promise<IEquipmentSharing>;
    /**
     * Updates an existing equipment sharing record.
     *
     * @param id - The unique identifier of the equipment sharing record to update.
     * @param input - The updated data for the equipment sharing record.
     * @returns A promise that resolves to the updated equipment sharing record.
     */
    update(id: ID, input: IEquipmentSharingUpdateInput): Promise<IEquipmentSharing>;
    /**
     * Approves an equipment sharing request.
     *
     * @param id - The unique identifier of the equipment sharing record to approve.
     * @returns A promise that resolves to the equipment sharing record updated with the approved status.
     */
    approval(id: ID): Promise<IEquipmentSharing>;
    /**
     * Refuses an equipment sharing request.
     *
     * @param id - The unique identifier of the equipment sharing record to refuse.
     * @returns A promise that resolves to the equipment sharing record updated with the refused status.
     */
    refuse(id: ID): Promise<IEquipmentSharing>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EquipmentSharingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EquipmentSharingService>;
}

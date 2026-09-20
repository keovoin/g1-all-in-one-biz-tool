import { DeleteResult } from 'typeorm';
import { ID, IEquipmentSharing, IEquipmentSharingCreateInput, IEquipmentSharingUpdateInput, IPagination } from '@gauzy/contracts';
import { ConfigService } from '@gauzy/config';
import { EquipmentSharing } from './equipment-sharing.entity';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmEquipmentSharingRepository } from './repository/type-orm-equipment-sharing.repository';
import { MikroOrmEquipmentSharingRepository } from './repository/mikro-orm-equipment-sharing.repository';
import { TypeOrmRequestApprovalRepository } from './../request-approval/repository/type-orm-request-approval.repository';
import { IReferenceScope } from './reference-scope.helper';
export declare class EquipmentSharingService extends TenantAwareCrudService<EquipmentSharing> {
    readonly typeOrmRequestApprovalRepository: TypeOrmRequestApprovalRepository;
    readonly configService: ConfigService;
    constructor(typeOrmEquipmentSharingRepository: TypeOrmEquipmentSharingRepository, mikroOrmEquipmentSharingRepository: MikroOrmEquipmentSharingRepository, typeOrmRequestApprovalRepository: TypeOrmRequestApprovalRepository, configService: ConfigService);
    /**
     * Refuses a referenced Equipment / EquipmentSharingPolicy that is not in the caller's scope.
     *
     * The update path is a delete-then-recreate that spreads the request body, so a body-supplied
     * `equipmentId` or `equipmentSharingPolicyId` is persisted as-is. Pinning the row's own
     * organization does not help: nothing validated what it POINTS AT, so an update could re-attach a
     * sharing to another organization's equipment. The foreign key only proves the row exists.
     *
     * Both targets extend TenantOrganizationBaseEntity, so both are scopeable.
     *
     * @param input - The update/create payload.
     * @param scope - The tenant/organization the record belongs to.
     * @throws ForbiddenException when a referenced row is outside the scope.
     */
    assertReferencesAreInScope(input: Partial<IEquipmentSharingUpdateInput>, scope: IReferenceScope): Promise<void>;
    /**
     * Retrieves equipment sharing records associated with a specific organization.
     *
     * @param organizationId - The unique identifier of the organization.
     * @returns A promise that resolves to an array of equipment sharing records.
     */
    findEquipmentSharingsByOrganizationId(organizationId: ID): Promise<IPagination<IEquipmentSharing>>;
    /**
     * Retrieves equipment sharing records associated with a specific employee.
     *
     * @param id - The unique identifier of the employee.
     * @returns A promise that resolves to a pagination object containing an array of equipment sharing records and the total count.
     * @throws BadRequestException if an error occurs during the database query.
     */
    findEquipmentSharingsByEmployeeId(id: ID): Promise<IPagination<IEquipmentSharing>>;
    /**
     * Retrieves all equipment sharing records with pagination.
     *
     * This function uses `findAndCount` to fetch all equipment sharing records along with the total
     * count. It loads related entities (`equipment`, `employees`, and `teams`) and returns an object
     * containing both the items and the total count.
     *
     * @returns A promise that resolves to an object with `items` (the equipment sharing records)
     *          and `total` (the total number of records).
     */
    findAllEquipmentSharings(): Promise<IPagination<IEquipmentSharing>>;
    /**
     * Creates a new EquipmentSharing record.
     *
     * @param equipmentSharing - The EquipmentSharing entity to be created.
     * @returns The saved EquipmentSharing entity.
     */
    createEquipmentSharing(entity: IEquipmentSharingCreateInput): Promise<EquipmentSharing>;
    /**
     * Updates an equipment sharing record by deleting the existing record and saving the updated input.
     *
     * @param id - The unique identifier for the equipment sharing record to update.
     * @param input - The new equipment sharing data.
     * @returns A promise that resolves to the updated EquipmentSharing record.
     */
    update(id: ID, input: IEquipmentSharingUpdateInput): Promise<EquipmentSharing>;
    /**
     * Deletes an equipment sharing record and its associated request approval.
     *
     * This function concurrently deletes the equipment sharing record from the primary repository
     * and the corresponding request approval record from the request approval repository.
     *
     * @param id - The unique identifier for the equipment sharing record to be deleted.
     * @returns A promise that resolves to the result of the equipment sharing deletion operation.
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Updates the status of an Equipment Sharing record by an admin.
     *
     * This function retrieves an Equipment Sharing record using its ID. If the record is found,
     * it updates the status property to the provided value and saves the updated record.
     * If the record is not found, it throws a NotFoundException.
     *
     * @param id - The unique identifier of the Equipment Sharing record.
     * @param status - The new status value to set for the Equipment Sharing record.
     * @returns A promise that resolves to the updated EquipmentSharing record.
     * @throws NotFoundException if no Equipment Sharing record is found with the provided ID.
     * @throws BadRequestException if an error occurs during the update process.
     */
    updateStatusEquipmentSharingByAdmin(id: ID, status: number): Promise<EquipmentSharing>;
    /**
     * Paginates equipment sharing records based on the provided filter.
     *
     * @param filter - An object containing pagination and filtering options.
     * @returns A promise that resolves to an IPagination object containing equipment sharing records and total count.
     */
    pagination(filter: any): Promise<IPagination<IEquipmentSharing>>;
}

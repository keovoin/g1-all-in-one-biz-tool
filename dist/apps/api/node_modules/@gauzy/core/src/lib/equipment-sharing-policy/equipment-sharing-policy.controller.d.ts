import { UpdateResult } from 'typeorm';
import { ID, IEquipmentSharingPolicy, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { EquipmentSharingPolicy } from './equipment-sharing-policy.entity';
import { EquipmentSharingPolicyService } from './equipment-sharing-policy.service';
import { UpdateOrCreateEquipmentSharingPolicyDTO } from './dto/update-or-create.dto';
export declare class EquipmentSharingPolicyController extends CrudController<EquipmentSharingPolicy> {
    readonly equipmentSharingPolicyService: EquipmentSharingPolicyService;
    constructor(equipmentSharingPolicyService: EquipmentSharingPolicyService);
    /**
     * GET equipment sharing policies by pagination.
     *
     * @param filter The pagination filter parameters.
     * @returns A paginated list of equipment sharing policies.
     */
    pagination(filter: BaseQueryDTO<EquipmentSharingPolicy>): Promise<IPagination<IEquipmentSharingPolicy>>;
    /**
     * Find all equipment sharing policies.
     *
     * @param params The pagination and filtering parameters.
     * @returns A list of equipment sharing policies.
     */
    findAll(params: BaseQueryDTO<EquipmentSharingPolicy>): Promise<IPagination<IEquipmentSharingPolicy>>;
    /**
     * Create a new Equipment Sharing Policy record.
     *
     * @param entity The EquipmentSharingPolicy object to create.
     * @returns The created EquipmentSharingPolicy object.
     */
    create(entity: UpdateOrCreateEquipmentSharingPolicyDTO): Promise<IEquipmentSharingPolicy>;
    /**
     * Update an existing Equipment Sharing Policy record.
     *
     * @param id The ID of the EquipmentSharingPolicy to update.
     * @param entity The updated EquipmentSharingPolicy object.
     * @returns The updated EquipmentSharingPolicy object or the update result.
     */
    update(id: ID, entity: UpdateOrCreateEquipmentSharingPolicyDTO): Promise<IEquipmentSharingPolicy | UpdateResult>;
}

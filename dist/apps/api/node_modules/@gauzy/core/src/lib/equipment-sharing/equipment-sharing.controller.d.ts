import { CommandBus } from '@nestjs/cqrs';
import { ID, IEquipmentSharing, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { EquipmentSharing } from './equipment-sharing.entity';
import { EquipmentSharingService } from './equipment-sharing.service';
export declare class EquipmentSharingController extends CrudController<EquipmentSharing> {
    private readonly equipmentSharingService;
    private commandBus;
    constructor(equipmentSharingService: EquipmentSharingService, commandBus: CommandBus);
    /**
     * GET equipment sharings by organization id
     *
     * @param orgId
     * @returns
     */
    findEquipmentSharingsByOrganizationId(organizationId: ID): Promise<IPagination<IEquipmentSharing>>;
    /**
     * GET equipment sharings by employee id
     *
     * @param employeeId
     * @returns
     */
    findEquipmentSharingsByEmployeeId(employeeId: ID): Promise<IPagination<IEquipmentSharing>>;
    /**
     * CREATE equipment sharing
     *
     * @param organizationId
     * @param equipmentSharing
     * @returns
     */
    createEquipmentSharing(organizationId: ID, entity: EquipmentSharing): Promise<IEquipmentSharing>;
    /**
     * UPDATE equipment sharings request approval
     *
     * @param id
     * @returns
     */
    equipmentSharingsRequestApproval(id: ID): Promise<IEquipmentSharing>;
    /**
     * UPDATE equipment sharings request refuse
     *
     * @param id
     * @returns
     */
    equipmentSharingsRequestRefuse(id: ID): Promise<IEquipmentSharing>;
    /**
     * GET equipment sharing by pagination
     *
     * @param filter
     * @returns
     */
    pagination(filter: BaseQueryDTO<EquipmentSharing>): Promise<IPagination<IEquipmentSharing>>;
    /**
     * GET all equipment sharings
     *
     * @param data
     * @returns
     */
    findAll(data: any): Promise<IPagination<IEquipmentSharing>>;
    /**
     * UPDATE equipment sharing by id
     *
     * @param id
     * @param equipmentSharing
     * @returns
     */
    update(id: ID, equipmentSharing: EquipmentSharing): Promise<IEquipmentSharing>;
}

import { CrudController, BaseQueryDTO } from './../core/crud';
import { IEquipment, IPagination } from '@gauzy/contracts';
import { Equipment } from './equipment.entity';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDTO, UpdateEquipmentDTO } from './dto';
export declare class EquipmentController extends CrudController<Equipment> {
    private readonly equipmentService;
    constructor(equipmentService: EquipmentService);
    pagination(filter: BaseQueryDTO<Equipment>): Promise<IPagination<IEquipment>>;
    findAll(data: any): Promise<IPagination<IEquipment>>;
    create(entity: CreateEquipmentDTO): Promise<IEquipment>;
    update(id: string, entity: UpdateEquipmentDTO): Promise<IEquipment>;
}

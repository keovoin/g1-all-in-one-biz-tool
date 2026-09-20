import { HttpClient } from '@angular/common/http';
import { IEquipment, IEquipmentFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EquipmentService {
    private http;
    EQUIPMENT_URL: string;
    constructor(http: HttpClient);
    getAll(relations?: string[], findInput?: IEquipmentFindInput): Promise<{
        items: IEquipment[];
    }>;
    delete(id: string): Promise<any>;
    save(equipment: IEquipment): Promise<IEquipment>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EquipmentService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EquipmentService>;
}

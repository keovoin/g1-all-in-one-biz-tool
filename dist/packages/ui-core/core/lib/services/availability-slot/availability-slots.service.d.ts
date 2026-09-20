import { HttpClient } from '@angular/common/http';
import { IAvailabilitySlot, IAvailabilitySlotsCreateInput, IAvailabilitySlotsFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class AvailabilitySlotsService {
    private http;
    AVAILABILITY_SLOTS_BASE_URI: string;
    constructor(http: HttpClient);
    create(createInput: IAvailabilitySlotsCreateInput): Promise<any>;
    createBulk(createInput: IAvailabilitySlotsCreateInput[]): Promise<any>;
    getAll(relations?: string[], findInput?: IAvailabilitySlotsFindInput): Promise<{
        items: IAvailabilitySlot[];
        total: number;
    }>;
    update(id: string, updateInput: IAvailabilitySlotsCreateInput): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AvailabilitySlotsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AvailabilitySlotsService>;
}

import { GuiDrag, IPersistance } from '@gauzy/ui-core/common';
export declare class Persistance implements IPersistance {
    private _state;
    constructor(state: Partial<GuiDrag>[]);
    get state(): Partial<GuiDrag>[];
}

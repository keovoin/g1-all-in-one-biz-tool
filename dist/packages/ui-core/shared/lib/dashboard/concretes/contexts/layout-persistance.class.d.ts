import { GuiDrag, ILayoutPersistance, IPersistance } from '@gauzy/ui-core/common';
import { Persistance } from './persistance.class';
export declare class LayoutPersistance implements ILayoutPersistance {
    private _state;
    save(): Persistance;
    restore(persistance: IPersistance): void;
    get state(): Partial<GuiDrag>[];
    set state(value: Partial<GuiDrag>[]);
}

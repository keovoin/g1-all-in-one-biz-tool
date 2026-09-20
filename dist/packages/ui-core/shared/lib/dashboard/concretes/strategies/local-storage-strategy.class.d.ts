import { BackupStrategy, GuiDrag } from '@gauzy/ui-core/common';
export declare class LocalStorageStrategy implements BackupStrategy {
    private _serializables;
    constructor();
    deSerialize(): Partial<GuiDrag>[];
    deSerialize(store?: Partial<GuiDrag>[], values?: Partial<GuiDrag>[]): Partial<GuiDrag>[];
    serialize(): Partial<GuiDrag>[];
    /**
     * Get all serializables
     */
    get serializables(): Partial<GuiDrag>[];
    /**
     * Set all serializables
     */
    set serializables(value: Partial<GuiDrag>[]);
}

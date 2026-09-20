import { BackupStrategy, GuiDrag } from '@gauzy/ui-core/common';
export declare class DatabaseStrategy implements BackupStrategy {
    get serializables(): Partial<GuiDrag>[];
    set serializables(value: Partial<GuiDrag>[]);
    serialize(): Partial<GuiDrag>[];
    deSerialize(): Partial<GuiDrag>[];
}

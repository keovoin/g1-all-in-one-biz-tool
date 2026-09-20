import { LayoutPersistance } from './layout-persistance.class';
export declare class PersistanceTakers {
    private _persistances;
    private _layout;
    constructor(layout: LayoutPersistance);
    backup(): void;
    undo(): void;
}

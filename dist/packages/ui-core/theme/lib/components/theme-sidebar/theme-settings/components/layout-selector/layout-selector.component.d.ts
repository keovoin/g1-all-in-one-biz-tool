import { OnDestroy, OnInit } from '@angular/core';
import { ComponentLayoutStyleEnum, IUser } from '@gauzy/contracts';
import { UsersService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class LayoutSelectorComponent implements OnInit, OnDestroy {
    private readonly store;
    private readonly userService;
    user: IUser;
    componentLayouts: ComponentLayoutStyleEnum[];
    preferredComponentLayout: ComponentLayoutStyleEnum;
    constructor(store: Store, userService: UsersService);
    ngOnInit(): void;
    switchComponentLayout(): void;
    resetLayoutForAllComponents(): void;
    /**
     * Updates the user's preferred component layout.
     *
     * @param input - User update payload containing layout preferences.
     */
    private changePreferredComponentLayout;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LayoutSelectorComponent, "gauzy-layout-selector", never, {}, {}, never, never, false, never>;
}

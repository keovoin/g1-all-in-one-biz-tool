import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
export interface ISidebarActionConfig {
    id: string;
    label: string;
    onClick?: (event: MouseEvent) => void;
    icon?: string;
    class?: string;
    permissions?: string[];
}
export interface ISidebarConfig {
    loadComponent: () => Promise<Type<any>> | Type<any>;
    id?: string;
    class?: string;
    title?: string;
    permissions?: string[];
    actionItem?: ISidebarActionConfig;
}
export declare class NavigationBuilderService {
    private readonly store;
    private sidebarMapper;
    sidebars$: Observable<ISidebarConfig[]>;
    private _sidebars;
    sidebarActions$: Observable<ISidebarActionConfig[]>;
    private _addedActionBarItems;
    constructor(store: Store);
    registerSidebar(id: string, config: ISidebarConfig): void;
    addSidebarActionItem(config: ISidebarActionConfig): void;
    getSidebarById(id: string): ISidebarConfig;
    getAvailableSidebarIds(): string[];
    getSidebarWidgets(): void;
    hasPermissions: (permissions: any) => boolean;
    clearSidebars(): void;
    clearActionBars(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavigationBuilderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NavigationBuilderService>;
}

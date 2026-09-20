import { OnDestroy } from '@angular/core';
import { NbLayoutComponent, NbLayoutRulerService, NbLayoutScrollService, NbViewportRulerAdapter } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class WindowModeBlockScrollService implements OnDestroy {
    private scrollService;
    private viewportRuler;
    private layout;
    private window;
    private destroy$;
    private blockEnabled;
    private unblock$;
    private container;
    private content;
    private previousScrollPosition;
    private previousContainerStyles;
    private previousContentStyles;
    constructor(scrollService: NbLayoutScrollService, viewportRuler: NbViewportRulerAdapter, layout: NbLayoutRulerService, window: any);
    ngOnDestroy(): void;
    register(layout: NbLayoutComponent): void;
    blockScroll(): void;
    unblockScroll(): void;
    private canBeBlocked;
    private updateContentSizeAndPosition;
    private backupStyles;
    private restoreStyles;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowModeBlockScrollService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WindowModeBlockScrollService>;
}

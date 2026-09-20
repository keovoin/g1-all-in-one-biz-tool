import { Inject, Injectable } from '@angular/core';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NB_WINDOW, NbLayoutRulerService, NbLayoutScrollService, NbViewportRulerAdapter } from '@nebular/theme';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { fromEvent as observableFromEvent, merge, Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
export class WindowModeBlockScrollService {
    constructor(scrollService, viewportRuler, layout, window) {
        this.scrollService = scrollService;
        this.viewportRuler = viewportRuler;
        this.layout = layout;
        this.window = window;
        this.destroy$ = new Subject();
        this.blockEnabled = false;
        this.unblock$ = new Subject();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.unblock$.complete();
    }
    register(layout) {
        this.container = layout.scrollableContainerRef.nativeElement;
        this.content = this.container.children[0];
        this.scrollService
            .onScrollableChange()
            .pipe(filter(() => layout.windowModeValue), map((scrollable) => !scrollable), takeUntil(this.destroy$))
            .subscribe((shouldBlock) => {
            if (shouldBlock) {
                this.blockScroll();
            }
            else {
                this.unblockScroll();
            }
        });
    }
    blockScroll() {
        if (!this.canBeBlocked()) {
            return;
        }
        this.previousScrollPosition = this.viewportRuler.getViewportScrollPosition();
        this.backupStyles();
        this.container.style.overflowY = 'scroll';
        this.content.style.overflow = 'hidden';
        this.content.style.position = 'fixed';
        this.updateContentSizeAndPosition();
        observableFromEvent(this.window, 'resize')
            .pipe(takeUntil(merge(this.destroy$, this.unblock$).pipe(take(1))))
            .subscribe(() => this.updateContentSizeAndPosition());
        this.blockEnabled = true;
    }
    unblockScroll() {
        if (this.blockEnabled) {
            this.restoreStyles();
            this.scrollService.scrollTo(this.previousScrollPosition.left, this.previousScrollPosition.top);
            this.unblock$.next();
            this.blockEnabled = false;
        }
    }
    canBeBlocked() {
        if (this.blockEnabled) {
            return false;
        }
        const { height: containerHeight } = this.viewportRuler.getViewportSize();
        return this.content.scrollHeight > containerHeight;
    }
    updateContentSizeAndPosition() {
        const { top, left } = this.container.getBoundingClientRect();
        this.content.style.left = coerceCssPixelValue(-this.previousScrollPosition.left + left);
        this.content.style.top = coerceCssPixelValue(-this.previousScrollPosition.top + top);
        this.layout
            .getDimensions()
            .pipe(map(({ clientWidth }) => coerceCssPixelValue(clientWidth)), take(1))
            .subscribe((clientWidth) => (this.content.style.width = clientWidth));
    }
    backupStyles() {
        this.previousContainerStyles = { overflowY: this.container.style.overflowY };
        this.previousContentStyles = {
            overflow: this.content.style.overflow,
            position: this.content.style.position,
            left: this.content.style.left,
            top: this.content.style.top,
            width: this.content.style.width
        };
    }
    restoreStyles() {
        this.container.style.overflowY = this.previousContainerStyles.overflowY;
        this.content.style.overflow = this.previousContentStyles.overflow;
        this.content.style.position = this.previousContentStyles.position;
        this.content.style.left = this.previousContentStyles.left;
        this.content.style.top = this.previousContentStyles.top;
        this.content.style.width = this.previousContentStyles.width;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowModeBlockScrollService, deps: [{ token: i1.NbLayoutScrollService }, { token: i1.NbViewportRulerAdapter }, { token: i1.NbLayoutRulerService }, { token: NB_WINDOW }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowModeBlockScrollService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowModeBlockScrollService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NbLayoutScrollService }, { type: i1.NbViewportRulerAdapter }, { type: i1.NbLayoutRulerService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [NB_WINDOW]
                }] }] });
//# sourceMappingURL=window-mode-block-scroll.service.js.map
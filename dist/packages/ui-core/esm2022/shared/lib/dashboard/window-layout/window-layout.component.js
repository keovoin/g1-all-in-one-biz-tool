import { __decorate } from "tslib";
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { LayoutWithDraggableObject } from '@gauzy/ui-core/common';
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../window/window.service';
import * as i0 from "@angular/core";
import * as i1 from "../window/window.component";
import * as i2 from "@angular/cdk/drag-drop";
let WindowLayoutComponent = class WindowLayoutComponent extends LayoutWithDraggableObject {
    constructor() {
        super(...arguments);
        this.windowService = inject(WindowService);
        this.cdr = inject(ChangeDetectorRef);
    }
    set windows(value) {
        this.draggableObject = value;
    }
    get windows() {
        if (this.windowService.windowsRef.length > 0 &&
            this.draggableObject !== this.windowService.windowsRef) {
            this.draggableObject = this.windowService.windowsRef;
        }
        return this.draggableObject;
    }
    ngOnInit() {
        this.windowService.windowsRef = this.draggableObject;
    }
    ngAfterViewInit() {
        this.listWidgets();
    }
    drop(event) {
        moveItemInArray(this.draggableObject, event.previousContainer.data, event.container.data);
        this.windowService.windowsRef = this.draggableObject;
        this.windowService.save();
        this.cdr.markForCheck();
    }
    /**
     * Subscribe to list windows changes
     */
    listWidgets() {
        this.listWindows.changes
            .pipe(tap((listWindows) => {
            this.windowService.windows$ = listWindows.toArray();
            this.cdr.markForCheck();
        }), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowLayoutComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: WindowLayoutComponent, isStandalone: false, selector: "ga-window-layout", inputs: { windows: "windows" }, viewQueries: [{ propertyName: "listWindows", predicate: WindowComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"masonry-boundary\" cdkDropListGroup>\n  @for (window of windows; track window; let index = $index) {\n    <div\n      class=\"window\"\n      cdkDropList\n      cdkDropListOrientation=\"horizontal\"\n      [cdkDropListData]=\"index\"\n      (cdkDropListDropped)=\"drop($event)\"\n      >\n      <ga-window\n        cdkDrag\n        (cdkDragEnded)=\"onDragEnded($event)\"\n        [windowDragEnded]=\"event\"\n        [templateRef]=\"window\"\n        [position]=\"index\"\n      ></ga-window>\n    </div>\n  }\n</div>\n", styles: [".masonry-boundary{-webkit-column-count:2;-moz-column-count:2;column-count:2;-webkit-column-gap:1rem;-moz-column-gap:1rem;column-gap:1rem}.masonry-boundary .window ga-window{cursor:pointer}.masonry-boundary .window ga-window ::ng-deep nb-card{margin:0}@media only screen and (max-width:1200px){.masonry-boundary{-moz-column-count:1;-webkit-column-count:1;column-count:1}}@media only screen and (min-width:1201px){.masonry-boundary{-moz-column-count:2;-webkit-column-count:2;column-count:2}}.cdk-drop-list-dragging>.cdk-drag-placeholder ::ng-deep nb-card nb-card-body{background-color:var(--gauzy-sidebar-background-3);border-radius:var(--border-radius)}.cdk-drag-preview ::ng-deep nb-card nb-card-body{filter:blur(10px)}.cdk-drop-list-dragging>*:not(.cdk-drag-placeholder){display:none}.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}\n"], dependencies: [{ kind: "component", type: i1.WindowComponent, selector: "ga-window", inputs: ["windowDragEnded"] }, { kind: "directive", type: i2.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep", "cdkDropListElementContainer", "cdkDropListHasAnchor"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i2.CdkDropListGroup, selector: "[cdkDropListGroup]", inputs: ["cdkDropListGroupDisabled"], exportAs: ["cdkDropListGroup"] }, { kind: "directive", type: i2.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
WindowLayoutComponent = __decorate([
    UntilDestroy({ checkProperties: true })
], WindowLayoutComponent);
export { WindowLayoutComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-window-layout', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div class=\"masonry-boundary\" cdkDropListGroup>\n  @for (window of windows; track window; let index = $index) {\n    <div\n      class=\"window\"\n      cdkDropList\n      cdkDropListOrientation=\"horizontal\"\n      [cdkDropListData]=\"index\"\n      (cdkDropListDropped)=\"drop($event)\"\n      >\n      <ga-window\n        cdkDrag\n        (cdkDragEnded)=\"onDragEnded($event)\"\n        [windowDragEnded]=\"event\"\n        [templateRef]=\"window\"\n        [position]=\"index\"\n      ></ga-window>\n    </div>\n  }\n</div>\n", styles: [".masonry-boundary{-webkit-column-count:2;-moz-column-count:2;column-count:2;-webkit-column-gap:1rem;-moz-column-gap:1rem;column-gap:1rem}.masonry-boundary .window ga-window{cursor:pointer}.masonry-boundary .window ga-window ::ng-deep nb-card{margin:0}@media only screen and (max-width:1200px){.masonry-boundary{-moz-column-count:1;-webkit-column-count:1;column-count:1}}@media only screen and (min-width:1201px){.masonry-boundary{-moz-column-count:2;-webkit-column-count:2;column-count:2}}.cdk-drop-list-dragging>.cdk-drag-placeholder ::ng-deep nb-card nb-card-body{background-color:var(--gauzy-sidebar-background-3);border-radius:var(--border-radius)}.cdk-drag-preview ::ng-deep nb-card nb-card-body{filter:blur(10px)}.cdk-drop-list-dragging>*:not(.cdk-drag-placeholder){display:none}.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}\n"] }]
        }], propDecorators: { listWindows: [{
                type: ViewChildren,
                args: [WindowComponent]
            }], windows: [{
                type: Input
            }] } });
//# sourceMappingURL=window-layout.component.js.map
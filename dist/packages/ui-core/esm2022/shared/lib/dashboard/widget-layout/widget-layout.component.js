import { __decorate } from "tslib";
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { LayoutWithDraggableObject } from '@gauzy/ui-core/common';
import { WidgetComponent } from '../widget/widget.component';
import { WidgetService } from '../widget/widget.service';
import * as i0 from "@angular/core";
import * as i1 from "../widget/widget.component";
import * as i2 from "@angular/cdk/drag-drop";
let WidgetLayoutComponent = class WidgetLayoutComponent extends LayoutWithDraggableObject {
    constructor() {
        super(...arguments);
        this.widgetService = inject(WidgetService);
        this.cdr = inject(ChangeDetectorRef);
    }
    set widgets(value) {
        this.draggableObject = value;
    }
    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }
    ngAfterViewInit() {
        this.listWidgets.changes
            .pipe(tap((listWidgets) => (this.widgetService.widgets$ = listWidgets.toArray())), untilDestroyed(this))
            .subscribe();
    }
    drop(event) {
        moveItemInArray(this.draggableObject, event.previousContainer.data, event.container.data);
        this.widgetService.widgetsRef = this.draggableObject;
        this.widgetService.save();
    }
    ngOnInit() {
        this.widgetService.widgetsRef = this.draggableObject;
    }
    get widgets() {
        if (this.widgetService.widgetsRef.length > 0 && this.draggableObject !== this.widgetService.widgetsRef)
            this.draggableObject = this.widgetService.widgetsRef;
        return this.draggableObject;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetLayoutComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: WidgetLayoutComponent, isStandalone: false, selector: "ga-widget-layout", inputs: { widgets: "widgets" }, viewQueries: [{ propertyName: "listWidgets", predicate: WidgetComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"grid-boundary\" cdkDropListGroup>\n\t@for (widget of widgets; track widget; let index = $index) {\n\t\t<div\n\t\t\tcdkDropList\n\t\t\tcdkDropListOrientation=\"horizontal\"\n\t\t\t[cdkDropListData]=\"index\"\n\t\t\t(cdkDropListDropped)=\"drop($event)\"\n\t\t>\n\t\t\t<ga-widget\n\t\t\t\tcdkDrag\n\t\t\t\t(cdkDragEnded)=\"onDragEnded($event)\"\n\t\t\t\t[widgetDragEnded]=\"event\"\n\t\t\t\t[templateRef]=\"widget\"\n\t\t\t\t[position]=\"index\"\n\t\t\t></ga-widget>\n\t\t</div>\n\t}\n</div>\n", styles: [".grid-boundary{display:flex;flex-wrap:wrap;margin:0 -.5rem}.grid-boundary ga-widget{cursor:pointer}.grid-boundary ga-widget ::ng-deep nb-card{margin:0}.cdk-drag-preview ::ng-deep nb-card nb-card-body{background-color:var(--color-primary-transparent-100);border-radius:var(--border-radius)}.cdk-drag-preview ::ng-deep nb-card nb-card-body *{color:var(--text-primary-color)!important}.cdk-drop-list-dragging>.cdk-drag-placeholder ::ng-deep nb-card nb-card-body{min-width:230px;background-color:var(--gauzy-sidebar-background-3);border-radius:var(--border-radius)}.cdk-drop-list-dragging>*:not(.cdk-drag-placeholder){display:none}.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}\n"], dependencies: [{ kind: "component", type: i1.WidgetComponent, selector: "ga-widget", inputs: ["widgetDragEnded"] }, { kind: "directive", type: i2.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep", "cdkDropListElementContainer", "cdkDropListHasAnchor"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i2.CdkDropListGroup, selector: "[cdkDropListGroup]", inputs: ["cdkDropListGroupDisabled"], exportAs: ["cdkDropListGroup"] }, { kind: "directive", type: i2.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }] }); }
};
WidgetLayoutComponent = __decorate([
    UntilDestroy({ checkProperties: true })
], WidgetLayoutComponent);
export { WidgetLayoutComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-widget-layout', standalone: false, template: "<div class=\"grid-boundary\" cdkDropListGroup>\n\t@for (widget of widgets; track widget; let index = $index) {\n\t\t<div\n\t\t\tcdkDropList\n\t\t\tcdkDropListOrientation=\"horizontal\"\n\t\t\t[cdkDropListData]=\"index\"\n\t\t\t(cdkDropListDropped)=\"drop($event)\"\n\t\t>\n\t\t\t<ga-widget\n\t\t\t\tcdkDrag\n\t\t\t\t(cdkDragEnded)=\"onDragEnded($event)\"\n\t\t\t\t[widgetDragEnded]=\"event\"\n\t\t\t\t[templateRef]=\"widget\"\n\t\t\t\t[position]=\"index\"\n\t\t\t></ga-widget>\n\t\t</div>\n\t}\n</div>\n", styles: [".grid-boundary{display:flex;flex-wrap:wrap;margin:0 -.5rem}.grid-boundary ga-widget{cursor:pointer}.grid-boundary ga-widget ::ng-deep nb-card{margin:0}.cdk-drag-preview ::ng-deep nb-card nb-card-body{background-color:var(--color-primary-transparent-100);border-radius:var(--border-radius)}.cdk-drag-preview ::ng-deep nb-card nb-card-body *{color:var(--text-primary-color)!important}.cdk-drop-list-dragging>.cdk-drag-placeholder ::ng-deep nb-card nb-card-body{min-width:230px;background-color:var(--gauzy-sidebar-background-3);border-radius:var(--border-radius)}.cdk-drop-list-dragging>*:not(.cdk-drag-placeholder){display:none}.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}\n"] }]
        }], propDecorators: { widgets: [{
                type: Input
            }], listWidgets: [{
                type: ViewChildren,
                args: [WidgetComponent]
            }] } });
//# sourceMappingURL=widget-layout.component.js.map
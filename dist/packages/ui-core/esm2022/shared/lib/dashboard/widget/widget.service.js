import { __decorate, __metadata } from "tslib";
import { inject, Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Store } from '@gauzy/ui-core/core';
import { LayoutPersistance } from '../concretes/contexts/layout-persistance.class';
import { PersistanceTakers } from '../concretes/contexts/persistance-takers.class';
import { LocalStorageStrategy } from '../concretes/strategies/local-storage-strategy.class';
import * as i0 from "@angular/core";
let WidgetService = class WidgetService {
    constructor() {
        this.store = inject(Store);
        this._widgetsRef = [];
        this._widgets = [];
        this._widgetLayoutPersistance = new LayoutPersistance();
        this._localStorage = new LocalStorageStrategy();
        this._widgetsTakers = new PersistanceTakers(this._widgetLayoutPersistance);
        this._widgets$ = new Subject();
        this._widgets$
            .pipe(tap((widgets) => (this.widgets = widgets)), tap(() => (this._widgetLayoutPersistance.state = this.widgets)), filter(() => this.widgetsRef.length === 0), tap(() => {
            this.retrieve().length === 0
                ? this.save()
                : this.retrieve().forEach((deserialized) => this.widgetsRef.push(deserialized.templateRef));
        }), untilDestroyed(this))
            .subscribe();
    }
    get widgetsRef() {
        return this._widgetsRef;
    }
    set widgetsRef(value) {
        this._widgetsRef = value;
        this.sorting();
    }
    sorting() {
        const buffers = [];
        this.widgetsRef.forEach((widgetRef) => {
            this.widgets.forEach((widget) => {
                if (widgetRef === widget.templateRef) {
                    buffers.push(widget);
                }
            });
        });
        this.widgets = buffers;
    }
    sortingReverse() {
        const buffers = [];
        this.widgets.forEach((widget) => {
            this.widgetsRef.forEach((widgetRef) => {
                if (widgetRef === widget.templateRef) {
                    buffers.push(widgetRef);
                }
            });
        });
        this.widgetsRef = buffers;
    }
    get widgets() {
        return this._widgets;
    }
    set widgets(value) {
        this._widgets = value;
    }
    save() {
        if (this.widgets.length === 0)
            return;
        this._widgetsTakers.backup();
        this._strategy = this._localStorage;
        this._strategy.serializables = this.widgets;
        this.store.widgets = this._strategy.serialize();
    }
    retrieve() {
        this._strategy = this._localStorage;
        this._strategy.serializables = this.widgets;
        return this._strategy.deSerialize(this.store.widgets);
    }
    undoDrag() {
        this._widgetsTakers.undo();
        this.widgets = this._widgetLayoutPersistance.state;
        this.sortingReverse();
        this._strategy = this._localStorage;
        this._strategy.serializables = this.widgets;
        this.store.widgets = this._strategy.serialize();
    }
    set widgets$(value) {
        this._widgets$.next(value);
    }
    updateWidget(value) {
        this.widgets.forEach((widget) => {
            if (widget.templateRef === value.templateRef) {
                value.hide = widget.hide;
                value.isCollapse = widget.isCollapse;
                value.isExpand = widget.isExpand;
            }
        });
    }
    hideWidget(position) {
        this.widgets.forEach((widget) => {
            if (widget.position === position) {
                widget.hide = true;
            }
        });
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetService, providedIn: 'root' }); }
};
WidgetService = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], WidgetService);
export { WidgetService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=widget.service.js.map
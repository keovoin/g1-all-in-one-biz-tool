import { __decorate, __metadata } from "tslib";
import { ApplicationRef, createComponent, Directive, ElementRef, EnvironmentInjector, HostListener, Injector, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UnderConstructionPopupComponent } from '../components/popup/popup.component';
import * as i0 from "@angular/core";
let UnderConstructionDirective = class UnderConstructionDirective {
    constructor() {
        this._elementRef = inject(ElementRef);
        this._dialogService = inject(NbDialogService);
        this._injector = inject(Injector);
        this._environmentInjector = inject(EnvironmentInjector);
        this._applicationRef = inject(ApplicationRef);
        // Create element
        const popup = document.createElement('popup-component');
        // Create the component using the modern API (Angular 13+)
        this._popupComponentRef = createComponent(UnderConstructionPopupComponent, {
            elementInjector: this._injector,
            environmentInjector: this._environmentInjector,
            hostElement: popup
        });
        // Attach to the view so that the change detector knows to run
        this._applicationRef.attachView(this._popupComponentRef.hostView);
        // Listen for event
        this._popupComponentRef.instance.onClosed
            .pipe(tap(() => this._dialogRef.close()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Opens a dialog if the target element is clicked.
     *
     * @param {MouseEvent} event - The mouse event that triggered the click.
     * @param {HTMLElement} targetElement - The element that was clicked.
     * @return {void} This function does not return anything.
     */
    open(event, targetElement) {
        if (!targetElement) {
            return;
        }
        const clicked = this._elementRef.nativeElement.contains(targetElement);
        if (clicked) {
            // Type assertion needed due to multiple @angular/core versions in monorepo causing TemplateRef type mismatch
            this._dialogRef = this._dialogService.open(this._popupComponentRef.instance.popup);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UnderConstructionDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: UnderConstructionDirective, isStandalone: true, selector: "[underConstruction]", host: { listeners: { "document:click": "open($event,$event.target)" } }, ngImport: i0 }); }
};
UnderConstructionDirective = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], UnderConstructionDirective);
export { UnderConstructionDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UnderConstructionDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[underConstruction]',
                    standalone: true
                }]
        }], ctorParameters: () => [], propDecorators: { open: [{
                type: HostListener,
                args: ['document:click', ['$event', '$event.target']]
            }] } });
//# sourceMappingURL=under-construction.directive.js.map
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../directives/trigger-parent-click.directive";
import * as i3 from "@angular/common";
import * as i4 from "@ngx-translate/core";
let ToggleSwitcherComponent = class ToggleSwitcherComponent {
    /**
     * Getter method for retrieving the toggle switch state as an Observable.
     *
     * @returns An Observable<boolean> that emits the current state and subsequent changes of the toggle switch.
     */
    get switcher$() {
        return this._switcher$.asObservable();
    }
    /**
     * Getter for retrieving the current value.
     *
     * @returns The current value of the dynamic element.
     */
    get value() {
        return this._value;
    }
    /**
     * Setter for updating the dynamic value.
     * This setter is decorated with @Input to allow external components to bind and update the value.
     *
     * @param value - The new value to set for the dynamic element.
     */
    set value(value) {
        // Updates the dynamic element's value using a BehaviorSubject or similar mechanism.
        this._switcher$.next(value);
        // Stores the value in the local variable for future reference.
        this._value = value;
    }
    /**
     * Getter for retrieving the current boolean label.
     *
     * @returns The current boolean label.
     */
    get label() {
        return this._label;
    }
    /**
     * Setter for updating the boolean label.
     * This setter is decorated with @Input to allow external components to bind and update the label.
     *
     * @param value - The new boolean label value.
     */
    set label(value) {
        // Update the boolean label with the provided value.
        this._label = value;
    }
    constructor() {
        /**
         * A class member that represents a boolean switch or toggle using a BehaviorSubject.
         */
        this._switcher$ = new BehaviorSubject(false);
        /**
         * A class member and getter/setter for managing a boolean label.
         */
        this._label = true;
        /**
         * An @Output property that emits a boolean value when an event occurs.
         *
         * This is used to create a custom event named 'switched' that can be listened to by external components.
         */
        this.onSwitched = new EventEmitter();
    }
    /**
     * The ngOnInit lifecycle hook is called when the component is initialized.
     * This method subscribes to the 'switched' Observable, and upon changes, updates the '_switcher$' BehaviorSubject.
     */
    ngOnInit() {
        this.onSwitched
            .pipe(tap((enable) => this._switcher$.next(enable)), 
        // The 'untilDestroyed' operator helps to automatically unsubscribe when the component is destroyed.
        untilDestroyed(this))
            .subscribe(); // Subscribe to the Observable but perform actions in 'tap'.
    }
    /**
     * Handles a change event for a boolean value.
     *
     * @param event - A boolean value representing the change event.
     */
    onCheckedChange(event) {
        // Emits the provided boolean 'event' using the 'switched' EventEmitter.
        this.onSwitched.emit(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToggleSwitcherComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ToggleSwitcherComponent, isStandalone: false, selector: "ngx-toggle-switcher", inputs: { value: "value", rowData: "rowData", label: "label" }, outputs: { onSwitched: "onSwitched" }, ngImport: i0, template: "<div>\n  <nb-toggle\n    status=\"primary\"\n    [checked]=\"switcher$ | async\"\n    (checkedChange)=\"onCheckedChange($event)\"\n    triggerParentClick\n    >\n    @if (label) {\n      {{ ((switcher$ | async) ? 'BUTTONS.ENABLED' : 'BUTTONS.DISABLED') | translate }}\n    }\n  </nb-toggle>\n</div>\n", dependencies: [{ kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "directive", type: i2.TriggerParentClickDirective, selector: "[triggerParentClick]" }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
ToggleSwitcherComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], ToggleSwitcherComponent);
export { ToggleSwitcherComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToggleSwitcherComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-toggle-switcher', standalone: false, template: "<div>\n  <nb-toggle\n    status=\"primary\"\n    [checked]=\"switcher$ | async\"\n    (checkedChange)=\"onCheckedChange($event)\"\n    triggerParentClick\n    >\n    @if (label) {\n      {{ ((switcher$ | async) ? 'BUTTONS.ENABLED' : 'BUTTONS.DISABLED') | translate }}\n    }\n  </nb-toggle>\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }], label: [{
                type: Input
            }], onSwitched: [{
                type: Output
            }] } });
//# sourceMappingURL=toggle-switcher.component.js.map
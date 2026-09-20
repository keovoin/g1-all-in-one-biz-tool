import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../../directives/debounce-click.directive";
import * as i3 from "@ngx-translate/core";
export class ResyncButtonComponent {
    constructor() {
        /**
         * An output property for emitting click events.
         *
         * This output property emits events of type Event when a click event occurs.
         */
        this.clicked = new EventEmitter();
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
        // Stores the value in the local variable for future reference.
        this._value = value;
    }
    /**
     * Handle a click event, conditionally emitting it for further processing.
     *
     * @param event - The click event to be handled.
     */
    onClicked(event) {
        // Access the repository data from the component's rowData.
        const repository = this.rowData.customFields?.repository;
        // Check if the repository data exists and has synchronization enabled.
        if (!repository || !repository.hasSyncEnabled) {
            return; // If repository is missing or synchronization is not enabled, exit the function.
        }
        // Emit the event using an EventEmitter, possibly to notify other parts of the application.
        this.clicked.emit(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ResyncButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ResyncButtonComponent, isStandalone: false, selector: "ngx-resync-button", inputs: { value: "value", rowData: "rowData" }, outputs: { clicked: "clicked" }, ngImport: i0, template: "<button\n\tnbButton\n\tstatus=\"primary\"\n\tclass=\"mr-2\"\n\tdebounceClick\n\t(throttledClick)=\"onClicked($event)\"\n\t[disabled]=\"!rowData?.customFields?.repository?.hasSyncEnabled\"\n>\n\t<div class=\"sync-container\">\n\t\t<nb-icon class=\"sync\" icon=\"sync-outline\"></nb-icon>\n\t\t{{ 'BUTTONS.RESYNC' | translate }}\n\t</div>\n</button>\n", dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.DebounceClickDirective, selector: "[debounceClick]", inputs: ["debounceTime"], outputs: ["throttledClick"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ResyncButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-resync-button', standalone: false, template: "<button\n\tnbButton\n\tstatus=\"primary\"\n\tclass=\"mr-2\"\n\tdebounceClick\n\t(throttledClick)=\"onClicked($event)\"\n\t[disabled]=\"!rowData?.customFields?.repository?.hasSyncEnabled\"\n>\n\t<div class=\"sync-container\">\n\t\t<nb-icon class=\"sync\" icon=\"sync-outline\"></nb-icon>\n\t\t{{ 'BUTTONS.RESYNC' | translate }}\n\t</div>\n</button>\n" }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }], clicked: [{
                type: Output
            }] } });
//# sourceMappingURL=resync-button.component.js.map
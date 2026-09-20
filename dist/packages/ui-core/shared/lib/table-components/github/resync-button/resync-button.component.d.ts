import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ResyncButtonComponent {
    /**
     * Getter and Setter for managing a dynamic value.
     */
    _value: any;
    /**
     * Getter for retrieving the current value.
     *
     * @returns The current value of the dynamic element.
     */
    get value(): any;
    /**
     * Setter for updating the dynamic value.
     * This setter is decorated with @Input to allow external components to bind and update the value.
     *
     * @param value - The new value to set for the dynamic element.
     */
    set value(value: any);
    /**
     * An @Input property used to pass data from a parent component to this component.
     *
     */
    rowData: any;
    /**
     * An output property for emitting click events.
     *
     * This output property emits events of type Event when a click event occurs.
     */
    clicked: EventEmitter<Event>;
    /**
     * Handle a click event, conditionally emitting it for further processing.
     *
     * @param event - The click event to be handled.
     */
    onClicked(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResyncButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ResyncButtonComponent, "ngx-resync-button", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, { "clicked": "clicked"; }, never, never, false, never>;
}

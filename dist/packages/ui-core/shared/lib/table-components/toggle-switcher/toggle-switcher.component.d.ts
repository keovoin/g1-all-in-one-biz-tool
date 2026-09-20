import { EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ToggleSwitcherComponent implements OnInit {
    /**
     * A class member that represents a boolean switch or toggle using a BehaviorSubject.
     */
    private _switcher$;
    /**
     * Getter method for retrieving the toggle switch state as an Observable.
     *
     * @returns An Observable<boolean> that emits the current state and subsequent changes of the toggle switch.
     */
    get switcher$(): Observable<boolean>;
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
     * A class member and getter/setter for managing a boolean label.
     */
    _label: boolean;
    /**
     * Getter for retrieving the current boolean label.
     *
     * @returns The current boolean label.
     */
    get label(): boolean;
    /**
     * Setter for updating the boolean label.
     * This setter is decorated with @Input to allow external components to bind and update the label.
     *
     * @param value - The new boolean label value.
     */
    set label(value: boolean);
    /**
     * An @Output property that emits a boolean value when an event occurs.
     *
     * This is used to create a custom event named 'switched' that can be listened to by external components.
     */
    onSwitched: EventEmitter<boolean>;
    constructor();
    /**
     * The ngOnInit lifecycle hook is called when the component is initialized.
     * This method subscribes to the 'switched' Observable, and upon changes, updates the '_switcher$' BehaviorSubject.
     */
    ngOnInit(): void;
    /**
     * Handles a change event for a boolean value.
     *
     * @param event - A boolean value representing the change event.
     */
    onCheckedChange(event: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToggleSwitcherComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToggleSwitcherComponent, "ngx-toggle-switcher", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; "label": { "alias": "label"; "required": false; }; }, { "onSwitched": "onSwitched"; }, never, never, false, never>;
}

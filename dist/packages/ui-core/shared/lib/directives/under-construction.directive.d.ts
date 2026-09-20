import * as i0 from "@angular/core";
export declare class UnderConstructionDirective {
    private _popupComponentRef;
    private _dialogRef;
    private readonly _elementRef;
    private readonly _dialogService;
    private readonly _injector;
    private readonly _environmentInjector;
    private readonly _applicationRef;
    constructor();
    /**
     * Opens a dialog if the target element is clicked.
     *
     * @param {MouseEvent} event - The mouse event that triggered the click.
     * @param {HTMLElement} targetElement - The element that was clicked.
     * @return {void} This function does not return anything.
     */
    open(event: MouseEvent, targetElement: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UnderConstructionDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<UnderConstructionDirective, "[underConstruction]", never, {}, {}, never, never, true, never>;
}

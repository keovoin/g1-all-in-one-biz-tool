import { ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ReadMoreDirective implements AfterViewInit, OnChanges {
    private el;
    private maxLength;
    private elementChange;
    private currentText;
    private hideToggle;
    private text;
    private isCollapsed;
    constructor(el: ElementRef);
    /**
     * @inheritDoc
     */
    ngAfterViewInit(): void;
    /**
     * @inheritDoc
     */
    ngOnChanges(): void;
    /**
     * Toggle view - full text or not
     */
    private toggleView;
    /**
     * Determine view
     */
    private determineView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReadMoreDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ReadMoreDirective, "[readMore]", never, { "maxLength": { "alias": "readMore-length"; "required": false; }; "elementChange": { "alias": "readMore-element"; "required": false; }; }, {}, never, never, true, never>;
}

import { EventEmitter, TemplateRef } from '@angular/core';
import { NbCardComponent } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class UnderConstructionPopupComponent {
    onClosed: EventEmitter<void>;
    private _popup;
    get popup(): TemplateRef<NbCardComponent>;
    set popup(content: TemplateRef<NbCardComponent>);
    constructor();
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UnderConstructionPopupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UnderConstructionPopupComponent, "gauzy-under-construction-popup", never, {}, { "onClosed": "onClosed"; }, never, never, false, never>;
}

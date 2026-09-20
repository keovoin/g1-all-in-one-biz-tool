import { OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class NgxFaqComponent implements OnInit, OnDestroy {
    private _faqs$;
    faqs$: Observable<any>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxFaqComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxFaqComponent, "ngx-faq", never, {}, {}, never, never, false, never>;
}

import { OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class CandidateCvComponent implements OnInit {
    private readonly fb;
    documentUrl: any;
    isDocument: false;
    form: any;
    cvUrl: any;
    constructor(fb: UntypedFormBuilder);
    ngOnInit(): void;
    loadFormData: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateCvComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateCvComponent, "ga-candidate-cv", never, { "documentUrl": { "alias": "documentUrl"; "required": false; }; "isDocument": { "alias": "isDocument"; "required": false; }; }, {}, never, never, false, never>;
}

import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as i0 from "@angular/core";
export declare class BackNavigationComponent implements OnInit {
    private readonly location;
    haveLink: boolean;
    constructor(location: Location);
    ngOnInit(): void;
    goBack(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BackNavigationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BackNavigationComponent, "ngx-back-navigation", never, { "haveLink": { "alias": "haveLink"; "required": false; }; }, {}, never, never, false, never>;
}

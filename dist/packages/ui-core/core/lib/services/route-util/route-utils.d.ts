import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class RouteUtil implements OnDestroy {
    private router;
    private activatedRoute;
    dataStore: {
        data: any;
    };
    private _data;
    constructor(router: Router, activatedRoute: ActivatedRoute);
    get data(): any;
    get data$(): Observable<any>;
    set data(value: any);
    updateData(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RouteUtil, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RouteUtil>;
}

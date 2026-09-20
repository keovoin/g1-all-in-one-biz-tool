import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ICurrency } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CurrencyService {
    private http;
    private _currencies$;
    currencies$: Observable<ICurrency[]>;
    find$: Subject<boolean>;
    constructor(http: HttpClient);
    private _loadCurrencies;
    getAll(): import("rxjs").Subscription | Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CurrencyService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CurrencyService>;
}

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ICountry } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CountryService {
    private http;
    private _countries$;
    countries$: Observable<ICountry[]>;
    find$: Subject<boolean>;
    constructor(http: HttpClient);
    private _loadCountries;
    getAll(): import("rxjs").Subscription | Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CountryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CountryService>;
}

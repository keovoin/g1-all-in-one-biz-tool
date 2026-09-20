import { Observable, Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class LayoutService {
    protected layoutSize$: Subject<unknown>;
    protected layoutSizeChange$: Observable<unknown>;
    changeLayoutSize(): void;
    onChangeLayoutSize(): Observable<any>;
    onSafeChangeLayoutSize(): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LayoutService>;
}

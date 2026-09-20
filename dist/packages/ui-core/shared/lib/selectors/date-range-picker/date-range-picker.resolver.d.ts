import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IDateRangePicker } from '@gauzy/contracts';
/**
 * Resolves the date range picker configuration based on the route parameters.
 *
 * @param route The activated route snapshot containing route information.
 * @param state The router state snapshot (not used but required in signature).
 * @returns An observable of type `IDateRangePicker` representing the resolved date range picker configuration.
 */
export declare const DateRangePickerResolver: ResolveFn<Observable<IDateRangePicker>>;

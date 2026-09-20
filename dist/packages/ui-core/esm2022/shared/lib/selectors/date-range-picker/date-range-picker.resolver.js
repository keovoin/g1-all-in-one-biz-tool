import { of } from 'rxjs';
import moment from 'moment';
import { parseToBoolean } from '@gauzy/ui-core/common';
/**
 * Resolves the date range picker configuration based on the route parameters.
 *
 * @param route The activated route snapshot containing route information.
 * @param state The router state snapshot (not used but required in signature).
 * @returns An observable of type `IDateRangePicker` representing the resolved date range picker configuration.
 */
export const DateRangePickerResolver = (route) => {
    // Extract the date range picker configuration from the route query parameters
    const { date, date_end, unit_of_time, is_custom_date = false } = route.queryParams;
    // Extract the unitOfTime from query parameters or route data
    const unitOfTime = unit_of_time ?? route.data.datePicker.unitOfTime;
    // Calculate the start date based on the route query parameter or the current date
    const startDate = date ? moment(date).startOf('day') : moment().startOf(unitOfTime);
    // Calculate the end date based on the route query parameter or the start date
    let endDate = date_end ? moment(date_end).endOf('day') : moment(startDate).endOf(unitOfTime);
    // Determine if a custom date range is being used
    const isCustomDate = parseToBoolean(is_custom_date) ?? !!date_end;
    // Return an observable emitting the resolved date range picker configuration
    return of({ startDate: startDate.toDate(), endDate: endDate.toDate(), isCustomDate, unitOfTime });
};
//# sourceMappingURL=date-range-picker.resolver.js.map
export interface IDateRangePicker {
    startDate: Date;
    endDate: Date;
    isCustomDate?: boolean;
}
export interface TimePeriod {
    startDate: moment.Moment;
    endDate: moment.Moment;
}
export interface DateRanges {
    [index: string]: [moment.Moment, moment.Moment];
}
export declare enum DateRangeKeyEnum {
    TODAY = "Today",
    YESTERDAY = "Yesterday",
    CURRENT_WEEK = "Current Week",
    LAST_WEEK = "Last Week",
    CURRENT_MONTH = "Current Month",
    LAST_MONTH = "Last Month"
}
export interface DateRangeClicked {
    label: DateRangeKeyEnum;
}

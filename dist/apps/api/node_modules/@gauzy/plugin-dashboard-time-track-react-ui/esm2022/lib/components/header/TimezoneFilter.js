import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from '@gauzy/ui-react';
import { Popover } from '@gauzy/ui-react-components';
import { useTimezoneFilter } from '../../hooks/use-timezone-filter';
import { NbButton } from '../NbButton';
import { NbIcon } from '../NbIcon';
/**
 * React port of `<ga-timezone-filter>`: the "BST: Europe - Isle of Man / 12 hour ⋮" button and
 * its popover with the Time Zone (UTC / Org / Mine) and Time Format (12 / 24 hour) lists. Picking
 * an entry applies it through `TimeZoneService`, persists it as a query param and closes the
 * popover — see {@link useTimezoneFilter} for the semantics.
 */
export function TimezoneFilter({ isTimezone = true, isTimeFormat = true }) {
    const { t } = useTranslation();
    const filter = useTimezoneFilter();
    const [open, setOpen] = useState(false);
    const pickZone = async (zone) => {
        setOpen(false);
        await filter.updateSelectedTimeZone(zone);
    };
    const pickFormat = async (format) => {
        setOpen(false);
        await filter.updateSelectedTimeFormat(format);
    };
    return (_jsx(Popover, { open: open, onOpenChange: setOpen, placement: "bottom", content: _jsxs("div", { className: "gz-rtt-popover-body", children: [isTimezone ? (_jsxs("div", { className: "gz-rtt-category", children: [_jsx("div", { className: "gz-rtt-view", children: t('TIMESHEET.TIME_ZONE') }), filter.timeZoneOptions.map((option) => (_jsxs("button", { type: "button", className: "gz-rtt-title", onClick: () => void pickZone(option.value), children: [_jsx("i", { className: "fas fa-check", style: { visibility: filter.selectedTimeZone === option.value ? 'visible' : 'hidden' } }), _jsx("div", { children: t(option.labelKey) })] }, option.value)))] })) : null, isTimezone && isTimeFormat ? _jsx("div", { className: "gz-rtt-line" }) : null, isTimeFormat ? (_jsxs("div", { className: "gz-rtt-category", children: [_jsx("div", { className: "gz-rtt-view", children: t('TIMESHEET.TIME_FORMAT') }), filter.timeFormatOptions.map((option) => (_jsxs("button", { type: "button", className: "gz-rtt-title", onClick: () => void pickFormat(option), children: [_jsx("i", { className: "fas fa-check", style: { visibility: filter.selectedTimeFormat === option ? 'visible' : 'hidden' } }), _jsxs("div", { children: [option, " hour"] })] }, option)))] })) : null] }), children: _jsxs(NbButton, { className: "gz-rtt-popover-button", size: "small", status: "basic", "aria-haspopup": "dialog", "aria-expanded": open, children: [_jsxs("div", { children: [isTimezone ? filter.timeZoneLabel : null, isTimeFormat ? ` / ${filter.selectedTimeFormat} hour` : null] }), _jsx(NbIcon, { icon: "more-vertical-outline" })] }) }));
}
//# sourceMappingURL=TimezoneFilter.js.map
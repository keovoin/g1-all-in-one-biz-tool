"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCounterPoints = computeCounterPoints;
exports.counterPointBackground = counterPointBackground;
exports.CounterPoint = CounterPoint;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const progress_status_1 = require("../helpers/progress-status");
const ProgressBar_1 = require("./ProgressBar");
/**
 * Computes the dot strip exactly like `gauzy-counter-point` (`packages/ui-core/shared/src/lib/counter-point`):
 * a zero capacity means one working day in seconds, anything above 24 is normalised to 24 dots,
 * and dots at or above the value are painted `basic`.
 *
 * @param total Capacity.
 * @param value Current value.
 * @param color Fill colour (status name or CSS colour); empty → status from the percentage.
 */
function computeCounterPoints(total, value, color) {
    let capacity = total === 0 ? 86400 : total;
    let current = value;
    if (capacity > 24) {
        current = (current / capacity) * 24;
        capacity = 24;
    }
    const points = [];
    for (let i = 0; i < capacity; i++) {
        points.push({
            color: i < current ? color || (0, progress_status_1.progressStatus)((current / capacity) * 100) : 'basic'
        });
    }
    return points;
}
/**
 * Resolves the CSS background for one dot.
 *
 * Nebular status names become `var(--color-<status>-default)`; anything that already reads as a
 * CSS colour (`#0088FE`, `rgb(...)`) is used verbatim — the Angular template only handles the
 * status form, so its hex-coloured strips fall through to an invalid `var(--color-#0088FE-default)`;
 * this port paints the colour the caller asked for.
 *
 * @param color Point colour.
 */
function counterPointBackground(color) {
    if (color === 'basic')
        return 'var(--progress-bar-danger-background-color)';
    if (/^(#|rgb|hsl|var\()/i.test(color))
        return color;
    return `var(--color-${color}-default)`;
}
/**
 * CounterPoint — React port of `<gauzy-counter-point>`: a strip of up to 24 pill-shaped dots
 * (10px high, 3px apart) or, with `progress`, a 10px Nebular progress bar.
 */
function CounterPoint({ total, value = 0, color = '', progress = false, className, style }) {
    // An UNKNOWN capacity (`total` undefined — the employees/projects count not loaded yet, or a
    // user without the permission to read it) paints no dots at all, exactly like the Angular
    // `gauzy-counter-point` (`for (i < undefined)` iterates zero times); `0` means "a day".
    const points = (0, react_1.useMemo)(() => (progress || total === undefined ? [] : computeCounterPoints(total, value, color)), [progress, total, value, color]);
    if (progress) {
        return ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, children: (0, jsx_runtime_1.jsx)(ProgressBar_1.ProgressBar, { value: value, height: "10px" }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '10px',
            justifyContent: 'space-between',
            ...style
        }, children: points.map((point, index) => ((0, jsx_runtime_1.jsx)("div", { className: `gzrc-counter-point ${point.color === 'basic' ? 'basic' : 'filled'}`, style: {
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                marginInlineEnd: '3px',
                background: counterPointBackground(point.color)
            } }, index))) }));
}
//# sourceMappingURL=CounterPoint.js.map
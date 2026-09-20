"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorDots = ColorDots;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../theme");
/** The dots count projects rather than identify them, so one accent is repeated. */
const DEFAULT_COLORS = [theme_1.theme.accent];
function ColorDots({ count, colors = DEFAULT_COLORS }) {
    return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', alignItems: 'center', gap: '0.3rem', paddingTop: '0.125rem' }, children: Array.from({ length: count }, (_, i) => ((0, jsx_runtime_1.jsx)("span", { style: {
                width: '0.625rem',
                height: '0.625rem',
                borderRadius: '50%',
                background: colors[i % colors.length],
                display: 'inline-block'
            } }, i))) }));
}
//# sourceMappingURL=ColorDots.js.map
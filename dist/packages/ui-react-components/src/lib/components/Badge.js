"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = Badge;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Badge — theme-adaptive port of `<nb-badge>` in its "unpositioned" dashboard form
 * (`position: unset; display: table; margin: 10px auto 0` in the Time Tracking SCSS).
 */
function Badge({ text, status = 'basic', className, style }) {
    return ((0, jsx_runtime_1.jsx)("span", { className: className, style: {
            display: 'table',
            margin: '10px auto 0',
            padding: 'var(--badge-padding)',
            borderRadius: 'var(--badge-border-radius)',
            background: `var(--badge-${status}-background-color)`,
            color: `var(--badge-${status}-text-color)`,
            fontFamily: 'var(--badge-text-font-family)',
            fontSize: 'var(--badge-text-font-size)',
            fontWeight: 'var(--badge-text-font-weight)',
            lineHeight: 'var(--badge-text-line-height)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            ...style
        }, children: text }));
}
//# sourceMappingURL=Badge.js.map
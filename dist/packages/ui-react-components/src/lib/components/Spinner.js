"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = Spinner;
const jsx_runtime_1 = require("react/jsx-runtime");
const inject_styles_1 = require("../helpers/inject-styles");
const SPINNER_CSS = `
@keyframes gzrc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.gzrc-spinner { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; z-index: 9999;
	display: flex; justify-content: center; align-items: center; }
.gzrc-spinner .gzrc-spin-circle { animation: gzrc-spin 0.8s infinite linear; border-radius: 50%;
	border-style: solid; border-width: 0.125em; width: 1em; height: 1em; }
.gzrc-spinner .gzrc-spin-message { margin-left: 0.5rem; }
`;
/**
 * Spinner — port of the `[nbSpinner]` overlay: an absolutely positioned veil that covers its
 * (relatively positioned) parent, tinted with `--spinner-<status>-background-color`, with the
 * rotating two-tone circle Nebular draws.
 *
 * The parent must be `position: relative` (the Angular directive sets that on the host too).
 */
function Spinner({ active, status = 'primary', size = 'giant', message, className, style }) {
    (0, inject_styles_1.useInjectedStyles)('gzrc-spinner-styles', SPINNER_CSS);
    if (!active)
        return null;
    const filled = `var(--spinner-${status}-circle-filled-color)`;
    const empty = `var(--spinner-${status}-circle-empty-color)`;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `gzrc-spinner${className ? ` ${className}` : ''}`, role: "status", "aria-live": "polite", style: {
            background: `var(--spinner-${status}-background-color)`,
            fontSize: `var(--spinner-height-${size})`,
            ...style
        }, children: [(0, jsx_runtime_1.jsx)("span", { className: "gzrc-spin-circle", style: { borderTopColor: filled, borderRightColor: empty, borderBottomColor: empty, borderLeftColor: filled } }), message ? ((0, jsx_runtime_1.jsx)("span", { className: "gzrc-spin-message", style: {
                    color: 'var(--spinner-text-color)',
                    fontSize: 'var(--spinner-text-font-size)',
                    fontWeight: 'var(--spinner-text-font-weight)',
                    lineHeight: 'var(--spinner-text-line-height)'
                }, children: message })) : null] }));
}
//# sourceMappingURL=Spinner.js.map
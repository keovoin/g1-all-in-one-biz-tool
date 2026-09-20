"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetCard = WidgetCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../theme");
const ui_1 = require("./ui");
/**
 * WidgetCard — stat/widget card, built on Card + CardContent.
 *
 * Mirrors Angular's widget structure: `<nb-card><nb-card-body>...</nb-card-body></nb-card>`.
 */
function WidgetCard({ label, value, loading = false, children }) {
    return ((0, jsx_runtime_1.jsx)(ui_1.Card, { style: { minWidth: '11rem', flex: '1 1 0' }, children: (0, jsx_runtime_1.jsxs)(ui_1.CardContent, { style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
                padding: '0.75rem 1rem 0.875rem'
            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.75rem', color: theme_1.theme.textSecondary, fontWeight: 500 }, children: label }), (0, jsx_runtime_1.jsx)("span", { style: {
                                color: theme_1.theme.textSecondary,
                                fontSize: '1rem',
                                lineHeight: 1,
                                paddingLeft: '0.5rem',
                                cursor: 'default',
                                userSelect: 'none'
                            }, children: "\u22EE" })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: loading ? theme_1.theme.textSecondary : theme_1.theme.textPrimary,
                        lineHeight: '2rem',
                        minHeight: '2rem'
                    }, children: loading ? '\u2014' : value }), children && (0, jsx_runtime_1.jsx)("div", { style: { marginTop: '0.125rem' }, children: children })] }) }));
}
//# sourceMappingURL=WidgetCard.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardHeader = CardHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../../theme");
/**
 * CardHeader — organizes the card's top section.
 *
 * Typically contains `<CardTitle>`, `<CardDescription>`, and optionally `<CardAction>`.
 * Renders with padding and a bottom border separator.
 */
function CardHeader({ children, style, className }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            padding: '0.875rem 1rem',
            borderBottom: `1px solid ${theme_1.theme.border}`,
            fontFamily: theme_1.theme.font,
            position: 'relative',
            ...style
        }, children: children }));
}
//# sourceMappingURL=CardHeader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDescription = CardDescription;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../../theme");
/**
 * CardDescription — helper text beneath the title for additional context.
 */
function CardDescription({ children, style, className }) {
    return ((0, jsx_runtime_1.jsx)("p", { className: className, style: {
            margin: 0,
            fontSize: '0.8125rem',
            color: theme_1.theme.textSecondary,
            lineHeight: 1.5,
            fontFamily: theme_1.theme.font,
            ...style
        }, children: children }));
}
//# sourceMappingURL=CardDescription.js.map
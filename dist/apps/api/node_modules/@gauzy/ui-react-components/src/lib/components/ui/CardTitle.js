"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardTitle = CardTitle;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../../theme");
/**
 * CardTitle — primary heading text within CardHeader.
 */
function CardTitle({ children, style, className }) {
    return ((0, jsx_runtime_1.jsx)("h3", { className: className, style: {
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: theme_1.theme.textPrimary,
            fontFamily: theme_1.theme.font,
            ...style
        }, children: children }));
}
//# sourceMappingURL=CardTitle.js.map
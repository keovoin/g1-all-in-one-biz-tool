"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardContent = CardContent;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../../theme");
/**
 * CardContent — main card body content section.
 */
function CardContent({ children, style, className }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            padding: '1rem',
            fontFamily: theme_1.theme.font,
            ...style
        }, children: children }));
}
//# sourceMappingURL=CardContent.js.map
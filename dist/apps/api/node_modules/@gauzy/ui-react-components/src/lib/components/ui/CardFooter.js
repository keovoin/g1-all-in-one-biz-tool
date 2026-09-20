"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardFooter = CardFooter;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = require("../../theme");
/**
 * CardFooter — secondary actions and footer content at the card's bottom.
 */
function CardFooter({ children, style, className }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderTop: `1px solid ${theme_1.theme.border}`,
            fontFamily: theme_1.theme.font,
            ...style
        }, children: children }));
}
//# sourceMappingURL=CardFooter.js.map